exports.formatPhoneForArkesel = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');

  // Convert international 233 format (e.g. 233241112233) to local format starting with 0 (e.g. 0241112233)
  if (cleaned.startsWith('233') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.substring(3);
  } else if (!cleaned.startsWith('0') && cleaned.length === 9) {
    cleaned = '0' + cleaned;
  }

  return cleaned;
};
