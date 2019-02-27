import { extrudeGeoJSON, extrudePolygon } from "geometry-extrude"
import {
  application,
  plugin,
  geometry as builtinGeometries,
  Geometry,
  Vector3
} from "claygl"
import { VectorTile } from "@mapbox/vector-tile"
import Protobuf from "pbf"
import ClayAdvancedRenderer from "claygl-advanced-renderer"
import LRU from "lru-cache"
import quickhull from "quickhull3d"
import tessellate from "./tessellate"
import vec2 from "claygl/src/glmatrix/vec2"
import PolyBool from "polybooljs"
import distortion from "./distortion"

const mvtCache = LRU(50)
const DEFAULT_CONFIG = {
  radius: 60,
  curveness: 1,

  showEarth: true,
  earthDepth: 4,
  earthColor: "#57e3d3",

  showBuildings: true,
  buildingsColor: "#9e62df",

  showRoads: true,
  roadsColor: "#dedede",

  showWater: true,
  waterColor: "#59dffc",

  showCloud: true,
  cloudColor: "#bdafff",

  rotateSpeed: 1,
  sky: false
}

const TILE_SIZE = 256
const config = DEFAULT_CONFIG

const mvtUrlTpl = `https://{s}.tile.nextzen.org/tilezen/vector/v1/${TILE_SIZE}/all/{z}/{x}/{y}.mvt?api_key=EWFsMD1DSEysLDWd2hj2cw`
const faces = ["pz", "px", "nz", "py", "nx", "ny"]
const vectorElements = [
  {
    type: "buildings",
    geometryType: "polygon",
    depth: feature => {
      return (feature.properties.height || 30) / 10 + 1
    }
  },
  {
    type: "roads",
    geometryType: "polyline",
    depth: 1.2
  },
  {
    type: "water",
    geometryType: "polygon",
    depth: 1
  }
]

function iterateFeatureCoordinates(feature, cb) {
  const geometry = feature.geometry
  if (geometry.type === "MultiPolygon") {
    for (let i = 0; i < geometry.coordinates.length; i++) {
      for (let k = 0; k < geometry.coordinates[i].length; k++) {
        geometry.coordinates[i][k] = cb(geometry.coordinates[i][k])
      }
    }
  } else if (
    geometry.type === "MultiLineString" ||
    geometry.type === "Polygon"
  ) {
    for (let i = 0; i < geometry.coordinates.length; i++) {
      geometry.coordinates[i] = cb(geometry.coordinates[i])
    }
  } else if (geometry.type === "LineString") {
    geometry.coordinates = cb(geometry.coordinates)
  }
}

function subdivideLongEdges(features, maxDist) {
  const v = []
  function addPoints(points) {
    const newPoints = []
    for (let i = 0; i < points.length - 1; i++) {
      vec2.sub(v, points[i + 1], points[i])
      const dist = vec2.len(v)
      vec2.scale(v, v, 1 / dist)
      newPoints.push(points[i])
      for (let d = maxDist; d < dist; d += maxDist) {
        newPoints.push(vec2.scaleAndAdd([], points[i], v, d))
      }
    }
    newPoints.push(points[points.length - 1])
    return newPoints
  }

  features.forEach(feature => {
    iterateFeatureCoordinates(feature, addPoints)
  })
}

function scaleFeature(feature, offset, scale) {
  function scalePoints(pts) {
    for (let i = 0; i < pts.length; i++) {
      pts[i][0] = (pts[i][0] + offset[0]) * scale[0]
      pts[i][1] = (pts[i][1] + offset[1]) * scale[1]
    }
    return pts
  }
  iterateFeatureCoordinates(feature, scalePoints)
}

function unionComplexPolygons(features) {
  const mergedCoordinates = []
  features.forEach(feature => {
    const geometry = feature.geometry
    if (geometry.type === "Polygon") {
      mergedCoordinates.push(feature.geometry.coordinates)
    } else if (geometry.type === "MultiPolygon") {
      for (let i = 0; i < feature.geometry.coordinates.length; i++) {
        mergedCoordinates.push(feature.geometry.coordinates[i])
      }
    }
  })
  const poly = PolyBool.polygonFromGeoJSON({
    type: "MultiPolygon",
    coordinates: mergedCoordinates
  })
  return {
    type: "Feature",
    properties: {},
    geometry: PolyBool.polygonToGeoJSON(poly)
  }
}

function unionRect(out, a, b) {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  out.x = x
  out.y = y
  out.width = Math.max(a.width + a.x, b.width + b.x) - x
  out.height = Math.max(a.height + a.y, b.height + b.y) - y
}

const width = 55
const height = 58.5
const earthRect = {
  x: -width / 2,
  y: -height / 2,
  width: width,
  height: height
}

function getRectCoords(rect) {
  return [
    [rect.x, rect.y],
    [rect.x + rect.width, rect.y],
    [rect.x + rect.width, rect.y + rect.height],
    [rect.x, rect.y + rect.height],
    [rect.x, rect.y]
  ]
}

const app = application.create("#viewport", {
  autoRender: false,
  devicePixelRatio: 2,

  init(app) {
    this._advRenderer = new ClayAdvancedRenderer(
      app.renderer,
      app.scene,
      app.timeline,
      {
        shadow: true,
        temporalSuperSampling: {
          enable: true,
          dynamic: false
        },
        postEffect: {
          enable: true,
          bloom: {
            enable: false
          },
          screenSpaceAmbientOcclusion: {
            enable: true,
            intensity: 1.1,
            radius: 5
          },
          FXAA: {
            enable: false
          }
        }
      }
    )

    this._advRenderer.setShadow({
      kernelSize: 10,
      blurSize: 3
    })

    const camera = app.createCamera([0, 0, 170], [0, 0, 0], "perspective")
    camera.update()
    this._camera = camera

    this._earthNode = app.createNode()
    this._cloudsNode = app.createNode()

    this._elementsNodes = {}
    this._elementsMaterials = {}

    this._diffuseTex = app.loadTextureSync(require("./paper-detail.png"), {
      anisotropic: 8
    })

    vectorElements.forEach(el => {
      this._elementsNodes[el.type] = app.createNode()
      this._elementsMaterials[el.type] = app.createMaterial({
        diffuseMap: this._diffuseTex,
        uvRepeat: [10, 10],
        color: config[el.type + "Color"],
        roughness: 1
      })
      this._elementsMaterials[el.type].name = "mat_" + el.type
    })

    const light = app.createDirectionalLight([-1, -1, -1], "#fff")
    light.shadowResolution = 2048
    light.shadowBias = 0.0005

    this._control = new plugin.OrbitControl({
      target: camera,
      domElement: app.container,
      timeline: app.timeline,
      rotateSensitivity: 2,
      orthographicAspect: app.renderer.getViewportAspect()
    })
    this._control.on("update", () => {
      this._advRenderer.render()
    })

    app.methods.updateEarthSphere()
    app.methods.updateElements()
    app.methods.updateVisibility()

    this._advRenderer.render()

    return app
      .createAmbientCubemapLight(require("./Grand_Canyon_C.hdr"), 0.2, 0.8, 1)
      .then(result => {
        const skybox = new plugin.Skybox({
          environmentMap: result.specular.cubemap,
          scene: app.scene
        })
        skybox.material.set("lod", 2)
        this._skybox = skybox
        this._advRenderer.render()
      })
  },

  methods: {
    updateEarthSphere(app) {
      this._earthNode.removeAll()

      const earthMat = app.createMaterial({
        roughness: 1,
        color: config.earthColor,
        diffuseMap: this._diffuseTex,
        uvRepeat: [2, 2]
      })
      earthMat.name = "mat_earth"

      faces.forEach(face => {
        const planeGeo = new builtinGeometries.Plane({
          widthSegments: 20,
          heightSegments: 20
        })
        app.createMesh(planeGeo, earthMat, this._earthNode)
        distortion(
          planeGeo.attributes.position.value,
          { x: -1, y: -1, width: 2, height: 2 },
          config.radius,
          config.curveness,
          face
        )
        planeGeo.generateVertexNormals()
      })

      this._cloudsNode.eachChild(cloudMesh => {
        const dist = cloudMesh.height + config.radius / Math.sqrt(2)
        cloudMesh.position.normalize().scale(dist)
      })

      this._advRenderer.render()
    },

    updateEarthGround(app, rect) {
      this._earthNode.removeAll()

      const { position, uv, normal, indices } = extrudePolygon(
        [[getRectCoords(earthRect)]],
        {
          depth: config.earthDepth
          // bevelSize: 0.3
        }
      )
      const geo = new Geometry()
      geo.attributes.position.value = position
      geo.attributes.normal.value = normal
      geo.attributes.texcoord0.value = uv
      geo.indices = indices
      geo.updateBoundingBox()
      const mesh = app.createMesh(
        geo,
        {
          nmae: "mat_earth",
          roughness: 1,
          color: config.earthColor,
          diffuseMap: this._diffuseTex,
          uvRepeat: [2, 2]
        },
        this._earthNode
      )
      mesh.rotation.rotateX(-Math.PI / 2)
      mesh.position.y = -config.earthDepth + 0.1

      app.methods.render()
    },

    updateElements(app) {
      this._id = Math.random()
      const advRenderer = this._advRenderer
      const elementsNodes = this._elementsNodes
      const elementsMaterials = this._elementsMaterials
      for (let key in elementsNodes) {
        elementsNodes[key].removeAll()
      }

      for (let key in this._buildingAnimators) {
        this._buildingAnimators[key].stop()
      }
      const buildingAnimators = (this._buildingAnimators = {})

      function createElementMesh(elConfig, features, boundingRect, idx) {
        if (elConfig.type === "roads" || elConfig.type === "water") {
          subdivideLongEdges(features, 4)
        }
        const result = extrudeGeoJSON(
          { features: features },
          {
            lineWidth: 0.5,
            excludeBottom: true,
            simplify: elConfig.type === "buildings" ? 0.01 : 0,
            depth: elConfig.depth
          }
        )
        const poly = result[elConfig.geometryType]
        const geo = new Geometry()
        if (elConfig.type === "water") {
          const { indices, position } = tessellate(
            poly.position,
            poly.indices,
            5
          )
          poly.indices = indices
          poly.position = position
        }
        geo.attributes.texcoord0.value = poly.uv
        geo.indices = poly.indices
        const mesh = app.createMesh(
          geo,
          elementsMaterials[elConfig.type],
          elementsNodes[elConfig.type]
        )
        if (elConfig.type === "buildings") {
          let positionAnimateFrom = new Float32Array(poly.position)
          let positionAnimateTo = poly.position
          for (let i = 0; i < positionAnimateFrom.length; i += 3) {
            const z = positionAnimateFrom[i + 2]
            if (z > 0) {
              positionAnimateFrom[i + 2] = 1
            }
          }

          positionAnimateTo = distortion(
            poly.position,
            boundingRect,
            config.radius,
            config.curveness,
            faces[idx]
          )
          positionAnimateFrom = distortion(
            positionAnimateFrom,
            boundingRect,
            config.radius,
            config.curveness,
            faces[idx]
          )
          geo.attributes.position.value = positionAnimateTo
          geo.generateVertexNormals()
          geo.updateBoundingBox()

          const transitionPosition = new Float32Array(positionAnimateFrom)
          geo.attributes.position.value = transitionPosition

          mesh.invisible = true
          const obj = {
            p: 0
          }
          buildingAnimators[faces[idx]] = app.timeline
            .animate(obj)
            .when(2000, {
              p: 1
            })
            .delay(1000)
            .during((obj, p) => {
              mesh.invisible = false
              for (let i = 0; i < transitionPosition.length; i++) {
                const a = positionAnimateFrom[i]
                const b = positionAnimateTo[i]
                transitionPosition[i] = (b - a) * p + a
              }
              geo.dirty()
              advRenderer.render()
            })
            .start("elasticOut")
        } else {
          geo.attributes.position.value = distortion(
            poly.position,
            boundingRect,
            config.radius,
            config.curveness,
            faces[idx]
          )

          geo.generateVertexNormals()
          geo.updateBoundingBox()
        }

        return { boundingRect: poly.boundingRect }
      }

      const { tiles, extents } = require("./tiles.json")
      let zipped = tiles.map((tile, i) => [tile, extents[i]])

      const subdomains = ["a", "b", "c"]
      zipped.forEach(([tile, extent], idx) => {
        const fetchId = this._id
        if (idx >= 6) {
          return
        }

        const scaleX = 1e4
        const scaleY = scaleX * 1.4
        const width = (extent.xmax - extent.xmin) * scaleX
        const height = (extent.ymax - extent.ymin) * scaleY
        const tileRect = {
          x: 0,
          y: 0,
          width: width,
          height: height
        }
        const allBoundingRect = {
          x: Infinity,
          y: Infinity,
          width: -Infinity,
          height: -Infinity
        }

        // const tile = tiles[idx];
        const url = mvtUrlTpl
          .replace("{z}", tile.z)
          .replace("{x}", tile.x)
          .replace("{y}", tile.y)
          .replace("{s}", subdomains[idx % 3])

        if (mvtCache.get(url)) {
          const features = mvtCache.get(url)
          for (let key in features) {
            createElementMesh(
              vectorElements.find(config => config.type === key),
              features[key],
              tile,
              idx
            )
          }

          return
        }

        return fetch(url, {
          mode: "cors"
        })
          .then(response => response.arrayBuffer())
          .then(buffer => {
            if (fetchId !== this._id) {
              return
            }

            const pbf = new Protobuf(new Uint8Array(buffer))
            const vTile = new VectorTile(pbf)
            if (!vTile.layers.buildings) {
              return
            }

            const features = {}
            ;["buildings", "roads", "water"].forEach(type => {
              if (!vTile.layers[type]) {
                return
              }
              features[type] = []
              for (let i = 0; i < vTile.layers[type].length; i++) {
                const feature = vTile.layers[type]
                  .feature(i)
                  .toGeoJSON(tile.x, tile.y, tile.z)
                scaleFeature(
                  feature,
                  [-extent.xmin, -extent.ymin],
                  [scaleX, scaleY]
                )
                features[type].push(feature)
              }
            })

            if (features.water) {
              features.water = [
                unionComplexPolygons(
                  features.water.filter(feature => {
                    const geoType = feature.geometry && feature.geometry.type
                    return geoType === "Polygon" || geoType === "MultiPolygon"
                  })
                )
              ]
            }
            features.roads = features.roads.filter(feature => {
              const geoType = feature.geometry && feature.geometry.type
              return geoType === "LineString" || geoType === "MultiLineString"
            })

            mvtCache.set(url, features)
            for (let key in features) {
              const { boundingRect } = createElementMesh(
                vectorElements.find(config => config.type === key),
                features[key],
                tileRect,
                idx
              )
              unionRect(allBoundingRect, boundingRect, allBoundingRect)
            }

            app.methods.render()
          })
      })
    },

    render(app) {
      this._control.orthographicAspect = app.renderer.getViewportAspect()
      this._advRenderer.render()
    },
    updateVisibility(app) {
      this._earthNode.invisible = !config.showEarth
      this._cloudsNode.invisible = !config.showCloud

      this._elementsNodes.buildings.invisible = !config.showBuildings
      this._elementsNodes.roads.invisible = !config.showRoads
      this._elementsNodes.water.invisible = !config.showWater

      app.methods.render()
    }
  }
})

window.addEventListener("resize", () => {
  app.resize()
  app.methods.render()
})

if (module.hot) {
  module.hot.dispose(function() {
    console.log(app)
    app.dispose()
  })
}
