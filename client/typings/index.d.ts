declare namespace EventHandler {
  export type clickHandler = (e: MouseEvent<HTMLButtonElement>) => void;
}

type anyFunc = (...args: any[]) => void;

declare var __BROWSER__: boolean;
