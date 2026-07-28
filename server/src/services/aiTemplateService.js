exports.generateTemplates = async ({ category, keywords }) => {
  let kw = 'Special Offer';
  if (Array.isArray(keywords) && keywords.length > 0 && keywords[0]) {
    kw = String(keywords[0]).trim();
  } else if (typeof keywords === 'string' && keywords.trim()) {
    kw = keywords.trim();
  }

  const cat = category || 'Marketing';

  const templateTexts = {
    Marketing: [
      `🔥 Exclusive Offer! Don't miss out on our ${kw}. Enjoy special discounts today only! Visit us or reply YES to claim now.`,
      `🎉 Big Announcement! Our ${kw} is officially live. Get up to 30% off your purchase. Limited stock available!`,
      `⭐ Hello! Special deal from FasReach: Grab your ${kw} package today before stock runs out!`,
    ],
    Transactional: [
      `Dear customer, your request for ${kw} has been processed successfully. Thank you for choosing us!`,
      `Notice: Payment received for ${kw}. Your reference ID is #8849. Contact support for assistance.`,
    ],
    OTP: [
      `Your verification code for ${kw} is: 849201. Valid for 10 minutes. Do not share this code with anyone.`,
      `Security Alert: 394012 is your secret code for ${kw}. Expires in 5 mins.`,
    ],
    Event: [
      `📢 Invitation: Join us for the upcoming ${kw} event! Date & venue details attached. RSVP now.`,
      `Reminder: The ${kw} starts tomorrow! We look forward to having you.`,
    ],
  };

  const selectedList = templateTexts[cat] || templateTexts.Marketing;

  return selectedList.map((text, idx) => ({
    id: idx + 1,
    content: text,
  }));
};
