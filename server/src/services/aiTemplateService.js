exports.generateTemplates = async ({ category, keywords }) => {
  const kw = keywords ? keywords.trim() : 'Special Promo';
  const cat = category || 'Marketing';

  const templates = {
    Marketing: [
      `🔥 Exclusive Offer! Don't miss out on our ${kw}. Enjoy special discounts today only! Visit our store or link now.`,
      `🎉 Big Announcement! Our ${kw} is officially live. Get up to 30% off your purchase. Reply YES for info!`,
      `⭐ Hello {first_name}, special deal from {company}! Grab your ${kw} package before stock runs out!`,
    ],
    Transactional: [
      `Dear {first_name}, your order for ${kw} has been processed successfully. Track status on your dashboard.`,
      `Notice: Payment received for ${kw}. Thank you for choosing {company}!`,
    ],
    OTP: [
      `Your verification code for ${kw} is: 849201. Valid for 10 minutes. Do not share this code with anyone.`,
      `{company} OTP: 394012 is your security code for ${kw}. Expires in 5 mins.`,
    ],
    Event: [
      `📢 Invitation: Join us for the upcoming ${kw} event! Date & venue details attached. RSVP now: {company}`,
      `Reminder: The ${kw} starts tomorrow! See you there. Contact {company} for support.`,
    ],
  };

  return templates[cat] || templates.Marketing;
};
