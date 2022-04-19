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

/**
 * Add the folder name of plugins to a plugin file name.
 *
 * @param {string} pluginName
 * @returns {string}
 */
const addPluginFolderName = (pluginName) => `${PLUGIN_BASE_PATH}${pluginName}`;

/**
 * Get relative path of a script file.
 *
 * @param {string} fileName
 * @returns {string}
 */
const getRelativePath = (fileName) =>
  path.join(__dirname, `${SCRIPT_BASE_PATH}${fileName}.js`);

/**
 * Read an MSR plugin file.
 *
 * @param {string} targetPluginName
 * @param  {...string} requiredPluginNames
 * @returns {object} MRS
 */
exports.readScripts = async (targetPluginName, ...requiredPluginNames) => {
  PIXI = require("pixi.js");
  MRS = undefined;
  const fileNames = [
    ...CORE_SCRIPT_NAMES,
    ...requiredPluginNames.map(addPluginFolderName),
    addPluginFolderName(targetPluginName),
  ];
  for (const fileName of fileNames) {
    const filePath = getRelativePath(fileName);
    const script = await fs.promises.readFile(filePath, "utf-8");
    eval(script);
  }
  return MRS;
};
