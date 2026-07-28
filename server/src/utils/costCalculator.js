const RATE_PER_UNIT = 0.04; // 0.04 GHS per unit

const calculateSmsUnits = (content) => {
  const charLength = content ? content.length : 0;
  if (charLength === 0) return 0;
  
  // Every 155 characters counts as 1 SMS unit
  return Math.ceil(charLength / 155);
};

module.exports = {
  RATE_PER_UNIT,
  calculateSmsUnits,
};
