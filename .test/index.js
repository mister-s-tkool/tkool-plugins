const path = require("path");
const fs = require("fs");

const SCRIPT_BASE_PATH = "../js/";
const PLUGIN_BASE_PATH = "plugins/";
const CORE_SCRIPT_NAMES = [
  "rmmz_core",
  "rmmz_managers",
  "rmmz_objects",
  "rmmz_sprites",
  "rmmz_windows",
  "rmmz_scenes",
];

exports.readScripts = async (targetPluginName) => {
  PIXI = require("pixi.js");
  const pluginPath = `${PLUGIN_BASE_PATH}${targetPluginName}`;
  MRS = undefined;
  for (const fileName of CORE_SCRIPT_NAMES.concat(pluginPath)) {
    const filePath = path.join(__dirname, `${SCRIPT_BASE_PATH}${fileName}.js`);
    const script = await fs.promises.readFile(filePath, "utf-8");
    eval(script);
  }
  return MRS;
};
