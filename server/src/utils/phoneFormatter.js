exports.formatPhoneForArkesel = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[\s\-\+\(\)]/g, '');

  // Convert Ghana local number starting with 0 (e.g. 0241112233) to 233241112233
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '233' + cleaned.substring(1);
  }

  return cleaned;
};
