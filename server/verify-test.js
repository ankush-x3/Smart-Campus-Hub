const axios = require("axios");

async function check() {
  try {
    const res = await axios.get("http://localhost:5000/api/announcements");
    const testRecord = res.data.data.find(a => a.title === "Atlas Migration Successful!");
    if(testRecord) {
      console.log("Test record found!");
    } else {
      console.log("Test record NOT found!");
    }
  } catch (err) {
    console.error(err.message);
  }
}
check();
