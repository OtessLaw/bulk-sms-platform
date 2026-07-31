exports.formatPhoneForArkesel = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');

  // Convert Ghana local number starting with 0 (e.g. 0241112233) to 233241112233
  if (cleaned.startsWith('0')) {
    cleaned = '233' + cleaned.substring(1);
  } else if (!cleaned.startsWith('233') && (cleaned.length === 9 || cleaned.length === 10)) {
    cleaned = '233' + cleaned;
  }

  return cleaned;
};
