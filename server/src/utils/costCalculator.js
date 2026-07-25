const RATE_PER_UNIT = 0.04; // 0.04 GHS per unit

const calculateSmsUnits = (content) => {
  const isUnicode = !/^[\n\r a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?£¥èéùìòÇØøÅåΔΦΓΛΩΠΨΣΘΞÆæßÉäöñüàäÖÑÜ§à]*$/.test(content);
  const charLength = content ? content.length : 0;
  
  if (isUnicode) {
    return charLength <= 70 ? 1 : Math.ceil(charLength / 67);
  } else {
    return charLength <= 160 ? 1 : Math.ceil(charLength / 153);
  }
};

module.exports = {
  RATE_PER_UNIT,
  calculateSmsUnits,
};
