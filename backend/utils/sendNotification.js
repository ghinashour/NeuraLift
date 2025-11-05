// utils/sendNotification.js
const Notification = require("../models/Notification");

const sendNotification = async ({ user, type, title, message, link }) => {
  const notif = await Notification.create({
    user,
    type,
    title,
    message,
    link,
  });
  return notif;
};

module.exports = sendNotification;
