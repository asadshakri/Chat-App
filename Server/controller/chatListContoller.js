const { Op } = require("sequelize");
const messages=require("../models/message");
const users=require("../models/user");

const getChatList = async (req, res) => {
  try {

    const myEmail = req.user.email;

    const allRooms = await messages.findAll({
      where: {
        roomName: {
          [Op.like]: `%${myEmail}%`
        }
      }
    });

    const partnerEmails = new Set();

    allRooms.forEach(msg => {
      const [email1, email2] = msg.roomName.split("-");

      if (email1 !== myEmail) partnerEmails.add(email1);
      if (email2 !== myEmail) partnerEmails.add(email2);
    });

    const partnerList = [...partnerEmails];

    const usersData = await users.findAll({
      where: {
        email: partnerList
      },
      attributes: ["id", "name", "email"]
    });

    res.status(200).json({ chatList: usersData });

  } catch (err) {
    console.error("Chat List Error:", err);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};

module.exports = { getChatList };