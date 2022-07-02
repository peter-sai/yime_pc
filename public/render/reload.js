const electron = require('electron');
const { machineIdSync } = require('node-machine-id');
let id = machineIdSync();
window.uuid = id;
window.Electron = electron;
console.log(electron);
