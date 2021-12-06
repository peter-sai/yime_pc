const fs = require('fs');
const path = require('path');

const light = {
  prominent: '#0085FF',
  navDef: '#404040',
  input: '#b3b3b3',
  warn: '#FF3432',
  inputborder: '#EDEDED',
  inputbackground: '#f9f9f9',
  main: '#333333',
  divider: '#f0f0f0',
  sub: '#666666',
  background: '#F4F4F4', //
  info: '#bdbdbd', //
  isMute: '#B6B7BA', //
  btnInfo: '#999', //
  encryption: '#f4f6ff', //
  yMsgBg: '#F3F3F6', //
  sendBg: '#F0F1F4', //
  send: '#CCCCCC', //
  sayHelloBg: '#F4F4F4', //
  background1: '#fff',
  toast: 'rgba(0, 0, 0, 0.8)',
  mask: 'rgba(0, 0, 0, 0.6)',
  dialog: '#f9f9f9',
  linearGradient: 'linear-gradient(45deg, #00BBFF, #0085FF)',
  groupIconBg: '#F0F0F0',
  groupIconText: '#0085FF',
  white: '#fff',
  operation: '#F1F2F6',
  linearGradient1:
    'linear-gradient(-90deg, #F0F1F4 0%, #f4f6ff 50%, #F0F1F4 100%)',
};

const dark = {
  prominent: '#006ED3',
  navDef: '#FFFFFF',
  input: '#b3b3b3',
  warn: '#FF3432',
  inputborder: '#212121',
  inputbackground: '#363636',
  main: '#ffffff',
  divider: '#444444',
  sub: '#666666',
  background: '#000', //
  info: '#bdbdbd', //
  isMute: '#68696D', // 静音 后 消息数量背景颜色
  btnInfo: '#444', //
  encryption: '#2b2b2b', //
  yMsgBg: '#585757', //
  sendBg: '#585757', //
  send: '#7F7F7F', //
  sayHelloBg: '#444444', //
  background1: '#121212',
  toast: 'rgba(77, 77, 77, 0.8)',
  mask: 'rgba(77, 77, 77, 0.6)',
  dialog: '#363636',
  linearGradient: 'linear-gradient(45deg, #2999FF, #0064C1)',
  groupIconBg: '#444444',
  groupIconText: '#0085FF',
  white: '#fff',
  operation: '#000',
  linearGradient1:
    'linear-gradient(-90deg, #444444 0%, #434343 50%, #444444 100%)',
};

let $str = '';
Object.keys(light).forEach((e) => {
  $str += `
    $--light--${e}: ${light[e]};
    $--dark--${e}: ${dark[e]};
  `;
});

let themesLight = '';
let themesDark = '';
let exportLight = '';
let exportDark = '';
Object.keys(light).forEach((e) => {
  themesLight += `
    ${e}: $--light--${e},
  `;
  themesDark += `
    ${e}: $--dark--${e},
  `;
  exportLight += `
    ${e}: $--light--${e};
  `;
  exportDark += `
    ${e}: $--dark--${e};
  `;
});

const $themes = `
$themes: (
  light: (
    ${themesLight}
  ),
  dark: (
    ${themesDark}
  )
);
`;

const $minxins = `
//遍历主题map
@mixin theme($attribute, $color) {
  @each $theme-name, $theme-map in $themes {
    [data-theme='#{$theme-name}'] & {
      @content;
      #{$attribute}: map-get($theme-map, $color);
    }
  }
};
`;

let $export = `
:export {
  light: {${exportLight}}
  dark: {${exportDark}}
};
`;

const out = $str + $themes + $minxins + $export;
// console.log(out);
fs.writeFileSync(path.join(__dirname, 'index.scss'), out);
