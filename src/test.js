const bcrypt = require("bcrypt");

let passT;

async function myFunction() {
  passT = await bcrypt.hash("okaokfea", 10);

  console.log(passT);
  const vrai = await bcrypt.compare("okaokfea", passT);

  console.log(vrai);
}

myFunction();
