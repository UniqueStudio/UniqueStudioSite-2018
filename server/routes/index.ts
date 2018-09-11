import koaRouter from 'koa-router';
import Controller from '../controllers/index';
const router = new koaRouter();

router.get('/*', Controller);

export default router;
