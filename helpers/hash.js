// hash.js
const bcrypt = require('bcrypt');

const myString = 'test'; // De string die je wilt hashen
const saltRounds = 10; // Aantal rounds voor het genereren van salt

bcrypt.hash(myString, saltRounds, function (err, hash) {
  if (err) {
    console.error(err);
  }
  return hash;
});
