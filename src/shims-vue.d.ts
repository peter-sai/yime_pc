/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "*.svg" {
  const content: any;
  export default content;
}
declare module "*.json" {
  const content: any;
  export default content;
}
declare module "*.wav" {
  const content: any;
  export default content;
}
declare module "*.mp3" {
  const content: any;
  export default content;
}

declare module 'Recorder' {
  const content: any;
  export default content;
}
declare module 'ClipboardItem' {
  const content: any;
  export default content;
}

declare module 'Electron' {
  const content: any;
  export default content;
}