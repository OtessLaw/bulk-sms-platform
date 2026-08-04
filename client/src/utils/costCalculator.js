export const RATE_PER_UNIT = 0.04;

export const hasEmojiOrUnicode = (text) => {
  if (!text) return false;
  return /[^\x00-\x7F]/.test(text);
};

export const calculateSmsUnits = (content) => {
  const charLength = content ? content.length : 0;
  if (charLength === 0) return 0;
  const isUnicode = hasEmojiOrUnicode(content);
  const charsPerUnit = isUnicode ? 95 : 160;
  return Math.ceil(charLength / charsPerUnit);
};

export const getSmsUnitDetails = (content) => {
  const charLength = content ? content.length : 0;
  if (charLength === 0) {
    return { charLength: 0, isUnicode: false, charsPerUnit: 160, units: 1 };
  }
  const isUnicode = hasEmojiOrUnicode(content);
  const charsPerUnit = isUnicode ? 95 : 160;
  const units = Math.ceil(charLength / charsPerUnit) || 1;
  return { charLength, isUnicode, charsPerUnit, units };
};
