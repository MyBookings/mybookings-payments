const path = require('path');
const jsConfig = require('./jsconfig.json');

module.exports = {
  presets: [
    ["env", {
      "targets": {
        "node": "current"
      }
    }]
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: [path.resolve(jsConfig.compilerOptions.baseUrl)],
      }
    ]
  ]
}
