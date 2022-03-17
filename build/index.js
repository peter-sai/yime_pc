const fs = require('fs');
const path = require('path');
let packageJson = {};

function changeJson(jsonFile, key, newVal) {
  packageJson = {};
  jsonFile = path.join(__dirname, jsonFile);
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      console.error(err);
    }
    // 获取json文件数据
    packageJson = data.toString();
    packageJson = JSON.parse(packageJson);

    if (packageJson[key] != newVal) {
      // 修改对应Key
      packageJson[key] = newVal;

      // 保存到文件
      let newJson = JSON.stringify(packageJson, null, '\t');
      fs.writeFile(jsonFile, newJson, function (err) {
        if (err) {
          console.error(err);
        }
      });
    }
  });
}

const config = {
  dev: 'YIME',
  yime: 'YIME',
  duoliao: 'DUOLIAO',
  momo: 'MOMO',
};

changeJson('../package.json', 'name', config[process.env.VUE_APP_MODE]);
