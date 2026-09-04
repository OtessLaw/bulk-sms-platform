const RATE_PER_UNIT = 0.04; // 0.04 GHS per unit

const hasEmojiOrUnicode = (text) => {
  if (!text) return false;
  // Detect emojis, non-ASCII symbols, and special Unicode characters
  return /[^\x00-\x7F]/.test(text);
};

const calculateSmsUnits = (content) => {
  const charLength = content ? content.length : 0;
  if (charLength === 0) return 0;
  
  // If message contains emojis or Unicode, limit is 70 chars per unit.
  // Standard text without emojis has a 160 char limit per unit.
  const isUnicode = hasEmojiOrUnicode(content);
  const charsPerUnit = isUnicode ? 70 : 160;

  return Math.ceil(charLength / charsPerUnit);
};

module.exports = {
  RATE_PER_UNIT,
  hasEmojiOrUnicode,
  calculateSmsUnits,
};
