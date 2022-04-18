/**
 * @jest-environment jsdom
 */

const { beforeAll, describe, expect, test } = require("@jest/globals");
const { readScripts } = require("./index");

beforeAll(async () => {
  MRS = await readScripts("MRS_PM_Core");
});

describe("parsers", () => {
  describe("parseString", () => {
    test("returns the trimmed string", () => {
      expect(MRS.PM.Core.parseString("    abc    ")).toBe("abc");
    });
    test("returns the same string", () => {
      expect(MRS.PM.Core.parseString("    abc    ", false)).toBe("    abc    ");
    });
    test("number is parsed into string", () => {
      expect(MRS.PM.Core.parseString(12345)).toBe("12345");
    });
    test("boolean is parsed into string", () => {
      expect(MRS.PM.Core.parseString(true)).toBe("true");
    });
    test("undefined is parsed into empty string", () => {
      expect(MRS.PM.Core.parseString(undefined)).toBe("");
    });
    test("null is parsed into empty string", () => {
      expect(MRS.PM.Core.parseString(null)).toBe("");
    });
  });
  describe("parseNumber", () => {
    test("number is parsed into number", () => {
      expect(MRS.PM.Core.parseNumber(123)).toBe(123);
    });
    test("number string is parsed into number", () => {
      expect(MRS.PM.Core.parseNumber("234")).toBe(234);
    });
    test("no-number value is parsed into default number", () => {
      expect(MRS.PM.Core.parseNumber(undefined, 345)).toBe(345);
    });
  });
  describe("parseBoolean", () => {
    test("boolean is parsed into boolean", () => {
      expect(MRS.PM.Core.parseBoolean(false)).toBe(false);
    });
    test("string 'true' is parsed into boolean true", () => {
      expect(MRS.PM.Core.parseBoolean("true")).toBe(true);
    });
    test("string other than 'true' is parsed into boolean false", () => {
      expect(MRS.PM.Core.parseBoolean("off")).toBe(false);
    });
  });
  describe("parseFullWidthNumberAlphabet", () => {
    test("half width alphabets and numbers are parsed into full width", () => {
      expect(
        MRS.PM.Core.parseFullWidthNumberAlphabet(
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789"
        )
      ).toBe(
        "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ" +
          "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ" +
          "０１２３４５６７８９"
      );
    });
    test("number is parsed into full width string", () => {
      expect(MRS.PM.Core.parseFullWidthNumberAlphabet(1234567890)).toBe(
        "１２３４５６７８９０"
      );
    });
  });
  describe("parseFullWidthKanaSymbol", () => {
    test("half width kana is parsed into full width kana", () => {
      expect(
        MRS.PM.Core.parseFullWidthKanaSymbol(
          "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ" +
            "ﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ" +
            "ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞ" +
            "ｧｨｩｪｫｬｭｮｰ"
        )
      ).toBe(
        "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
          "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
          "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴ" +
          "ァィゥェォャュョー"
      );
    });
    test("half width symbols are parsed into full width symbols", () => {
      expect(
        MRS.PM.Core.parseFullWidthKanaSymbol(
          `｡､｢｣･ .,:;()"'[]{}-+*/%!?#$<>=~^|_`
        )
      ).toBe(
        "。、「」・　．，：；（）”’［］｛｝－＋＊／％！？＃＄＜＞＝～＾｜＿"
      );
    });
  });
  describe("parseFullWidthString", () => {
    test("half width characters are parsed into full width", () => {
      expect(
        MRS.PM.Core.parseFullWidthString(
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789" +
            "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ" +
            "ﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ" +
            "ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞ" +
            "ｧｨｩｪｫｬｭｮｰ" +
            `｡､｢｣･ .,:;()"'[]{}-+*/%!?#$<>=~^|_`
        )
      ).toBe(
        "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ" +
          "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ" +
          "０１２３４５６７８９" +
          "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
          "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
          "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴ" +
          "ァィゥェォャュョー" +
          "。、「」・　．，：；（）”’［］｛｝－＋＊／％！？＃＄＜＞＝～＾｜＿"
      );
    });
  });
});
