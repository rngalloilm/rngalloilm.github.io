module.exports.generateAvatarFor = (username) =>
    `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(username)}`;
  