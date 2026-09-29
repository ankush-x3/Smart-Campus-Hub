require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function check() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'email role name password');
    console.log(users);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
check();
