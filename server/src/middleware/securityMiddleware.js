// Custom Input Sanitizer & NoSQL Injection Protection
const sanitizeInput = (req, res, next) => {
  const cleanObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    for (const key in obj) {
      // Strip MongoDB operator characters ($ and .) from keys to block NoSQL query injection
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
        continue;
      }

      if (typeof obj[key] === 'string') {
        // Basic HTML XSS script tag stripping
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      } else if (typeof obj[key] === 'object') {
        cleanObject(obj[key]);
      }
    }
  };

  if (req.body) cleanObject(req.body);
  if (req.query) cleanObject(req.query);
  if (req.params) cleanObject(req.params);

  next();
};

module.exports = { sanitizeInput };
