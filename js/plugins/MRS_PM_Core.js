//=============================================================================
// MRS_PM_Core.js
// Version: 1.0.0
//----------------------------------------------------------------------------
// Copyright (c) 2022 Mr.S
// Released under the MIT license
// https://opensource.org/licenses/mit-license.php
//----------------------------------------------------------------------------
// Versions
// 1.0.0 2022/xx/xx Release
//----------------------------------------------------------------------------
// [GitHub] https://github.com/mister-s-tkool/tkool-plugins
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Core plugin for MRS_PM plugins
 * @author Mr.S
 *
 * @help MRS_PM_Core.js
 *
 * This plugin is the base plugin for MRS_PM.
 * It provides common functions and system for all MRS_PM plugins.
 *
 * It does not provide plugin commands.
 */

/*:ja
 * @target MZ
 * @plugindesc MRS_PM系基幹プラグイン
 * @author Mr.S
 *
 * @help MRS_PM_Core.js
 *
 * このプラグインは、MRS_PM系プラグインの基幹プラグインです。
 * 各プラグイン共通で使用する関数、システムを提供します。
 *
 * プラグインコマンドはありません。
 */

/**
 * Namespace for MRS.
 *
 * @namespace
 */
var MRS = MRS ?? {};

{
  /**
   * Namespace for MSR_PM.
   *
   * @memberof MRS
   * @namespace
   */
  MRS.PM = MRS.PM ?? {};

  /**
   * Namespace for this plugin.
   *
   * @memberof MRS.PM
   * @namespace
   */
  MRS.PM.Core = {};

  //-----------------------------------------------------------------------------
  // Constants

  const HALF_CHARS = [
    ["ｳﾞ", "ｰ", "｡", "､", "｢", "｣", "･", " "],
    [".", ",", ":", ";", "(", ")", `"`, `'`],
    ["[", "]", "{", "}", "-", "+", "*", "/", "%"],
    ["!", "?", "#", "$", "<", ">", "=", "~", "^", "|", "_"],
    ["ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ"],
    ["ｻﾞ", "ｼﾞ", "ｽﾞ", "ｾﾞ", "ｿﾞ"],
    ["ﾀﾞ", "ﾁﾞ", "ﾂﾞ", "ﾃﾞ", "ﾄﾞ"],
    ["ﾊﾞ", "ﾋﾞ", "ﾌﾞ", "ﾍﾞ", "ﾎﾞ"],
    ["ﾊﾟ", "ﾋﾟ", "ﾌﾟ", "ﾍﾟ", "ﾎﾟ"],
    ["ｧ", "ｨ", "ｩ", "ｪ", "ｫ"],
    ["ｬ", "ｭ", "ｮ"],
    ["ｱ", "ｲ", "ｳ", "ｴ", "ｵ"],
    ["ｶ", "ｷ", "ｸ", "ｹ", "ｺ"],
    ["ｻ", "ｼ", "ｽ", "ｾ", "ｿ"],
    ["ﾀ", "ﾁ", "ﾂ", "ﾃ", "ﾄ"],
    ["ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ"],
    ["ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ"],
    ["ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ"],
    ["ﾔ", "ﾕ", "ﾖ"],
    ["ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ"],
    ["ﾜ", "ｦ", "ﾝ"],
  ].flat();

  const FULL_CHARS = [
    ["ヴ", "ー", "。", "、", "「", "」", "・", "　"],
    ["．", "，", "：", "；", "（", "）", "”", "’"],
    ["［", "］", "｛", "｝", "－", "＋", "＊", "／", "％"],
    ["！", "？", "＃", "＄", "＜", "＞", "＝", "～", "＾", "｜", "＿"],
    ["ガ", "ギ", "グ", "ゲ", "ゴ"],
    ["ザ", "ジ", "ズ", "ゼ", "ゾ"],
    ["ダ", "ヂ", "ヅ", "デ", "ド"],
    ["バ", "ビ", "ブ", "ベ", "ボ"],
    ["パ", "ピ", "プ", "ペ", "ポ"],
    ["ァ", "ィ", "ゥ", "ェ", "ォ"],
    ["ャ", "ュ", "ョ"],
    ["ア", "イ", "ウ", "エ", "オ"],
    ["カ", "キ", "ク", "ケ", "コ"],
    ["サ", "シ", "ス", "セ", "ソ"],
    ["タ", "チ", "ツ", "テ", "ト"],
    ["ナ", "ニ", "ヌ", "ネ", "ノ"],
    ["ハ", "ヒ", "フ", "ヘ", "ホ"],
    ["マ", "ミ", "ム", "メ", "モ"],
    ["ヤ", "ユ", "ヨ"],
    ["ラ", "リ", "ル", "レ", "ロ"],
    ["ワ", "ヲ", "ン"],
  ].flat();

  const REGEXP_ESCAPE_CHARS = [
    [".", "(", ")"],
    ["[", "]", "{", "}", "-", "+", "*", "/"],
    ["?", "$", "^", "|"],
  ].flat();

  const ESCAPED_HALF_CHARS = HALF_CHARS.map((halfChar) =>
    REGEXP_ESCAPE_CHARS.includes(halfChar) ? `\\${halfChar}` : halfChar
  );

  const KANA_MAP = new Map(
    HALF_CHARS.map((halfChar, i) => [halfChar, FULL_CHARS[i]])
  );

  //-----------------------------------------------------------------------------
  // Utilities for parsing values.

  /**
   * Parse a value to string.
   *
   * @memberof MRS.PM.Core
   * @param {unknown} value
   * @returns {string}
   */
  MRS.PM.Core.parseString = (value, trim = true) => {
    const str = String(value ?? "");
    return trim ? str.trim() : str;
  };

  /**
   * Parse a value to number.
   *
   * @memberof MRS.PM.Core
   * @param {unknown} value
   * @param {number} defaultValue
   * @returns {number}
   */
  MRS.PM.Core.parseNumber = (value, defaultValue = 0) =>
    parseInt(value, 10) || defaultValue;

  /**
   * Parse a value to boolean.
   *
   * @memberof MRS.PM.Core
   * @param {unknown} value
   * @returns {boolean}
   */
  MRS.PM.Core.parseBoolean = (value) =>
    typeof value === "string" ? value === "true" : !!value;

  /**
   * Parse a value to string with full width numbers and alphabets.
   *
   * @memberof MRS.PM.Core
   * @param {unknown} value
   * @returns {string}
   */
  MRS.PM.Core.parseFullWidthNumberAlphabet = (value) =>
    MRS.PM.Core.parseString(value).replace(/[A-Za-z0-9]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    );

  /**
   * Parse a value to string with full width kanas and symbols.
   *
   * @memberof MRS.PM.Core
   * @param {unknown} value
   * @returns {string}
   */
  MRS.PM.Core.parseFullWidthKanaSymbol = (value) =>
    MRS.PM.Core.parseString(value).replace(
      new RegExp(`(${ESCAPED_HALF_CHARS.join("|")})`, "g"),
      (halfChar) => KANA_MAP.get(halfChar) ?? halfChar
    );

  /**
   * Parse a value to string with full width.
   *
   * @memberof MRS.PM.Core
   * @param {unknown} value
   * @returns {string}
   */
  MRS.PM.Core.parseFullWidthString = (value) =>
    MRS.PM.Core.parseFullWidthKanaSymbol(
      MRS.PM.Core.parseFullWidthNumberAlphabet(value)
    );

  //-----------------------------------------------------------------------------
  // Utilities for getting values from the core script.

  /**
   * Get the meta data of the target data object.
   *
   * @param {object} target data object
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getMeta = (target, tagName) => {
    const meta = target?.meta;
    if (!meta) return false;
    return meta[tagName] || meta[tagName.toLowerCase()] || false;
  };

  /**
   * Get the meta data of a map data.
   *
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getCurrentMapMeta = (tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataMap, tagName);
  };

  /**
   * Get the meta data of an event data of the current map.
   *
   * @param {number} eventId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getEventMeta = (eventId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataMap?.events[eventId], tagName);
  };

  /**
   * Get the meta data of an actor data.
   *
   * @param {number} actorId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getActorMeta = (actorId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataActors?.[actorId], tagName);
  };

  /**
   * Get the meta data of a class data.
   *
   * @param {number} classId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getClassMeta = (classId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataClasses?.[classId], tagName);
  };

  /**
   * Get the meta data of a skill data.
   *
   * @param {number} skillId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getSkillMeta = (skillId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataSkills?.[skillId], tagName);
  };

  /**
   * Get the meta data of an item data.
   *
   * @param {number} itemId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getItemMeta = (itemId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataItems?.[itemId], tagName);
  };

  /**
   * Get the meta data of a weapon data.
   *
   * @param {number} weaponId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getWeaponMeta = (weaponId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataWeapons?.[weaponId], tagName);
  };

  /**
   * Get the meta data of an armor data.
   *
   * @param {number} armorId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getArmorMeta = (armorId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataArmors?.[armorId], tagName);
  };

  /**
   * Get the meta data of an enemy data.
   *
   * @param {number} enemyId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getEnemyMeta = (enemyId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataEnemies?.[enemyId], tagName);
  };

  /**
   * Get the meta data of a state data.
   *
   * @param {number} stateId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getStateMeta = (stateId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataStates?.[stateId], tagName);
  };

  /**
   * Get the meta data of a tileset data.
   *
   * @param {number} tilesetId
   * @param {string} tagName snake case
   * @returns {boolean | string}
   */
  MRS.PM.Core.getTilesetMeta = (tilesetId, tagName) => {
    return MRS.PM.Core.getMeta(globalThis.$dataTilesets?.[tilesetId], tagName);
  };
}
