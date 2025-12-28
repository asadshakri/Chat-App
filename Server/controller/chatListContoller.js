const { Op } = require("sequelize");
const messages = require("../models/message");
const users = require("../models/user");
const groups = require("../models/group");

const getChatList = async (req, res) => {
  try {
    const myUserId = req.user.id;
    const myEmail = req.user.email;



    const personalRooms = await messages.findAll({
      where: {
        roomName: {
          [Op.like]: `%${myEmail}%`
        }
      },
      attributes: ["roomName"],
      group: ["roomName"]
    });

    const partnerEmails = new Set();

    personalRooms.forEach(msg => {
      if (!msg.roomName.includes("-")) return;

      const [e1, e2] = msg.roomName.split("-");
      if (e1 !== myEmail) partnerEmails.add(e1);
      if (e2 !== myEmail) partnerEmails.add(e2);
    });

    const usersData = await users.findAll({
      where: { email: [...partnerEmails] },
      attributes: ["id", "name", "email"]
    });

    const personalChats = usersData.map(u => ({
      type: "user",
      id: u.id,
      name: u.name,
      email: u.email
    }));



    const myGroups = await users.findByPk(myUserId, {
      include: [{
        model: groups,
        attributes: ["uuid", "name"],
        through: { attributes: [] } // hide junction table
      }]
    });

    const groupChats = myGroups.groups.map(g => ({
      type: "group",
      uuid: g.uuid,
      name: g.name
    }));


    res.status(200).json({
      chatList: [...personalChats, ...groupChats]
    });

  } catch (err) {
    console.error("Chat List Error:", err);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};

module.exports = { getChatList };