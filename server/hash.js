// שמור בקובץ hash.js והריץ: node hash.js
const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "1234!1234"; // פה תכתוב את הסיסמה שאתה רוצה
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

generateHash();
