const { generateKeyPairSync } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },

  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

fs.writeFileSync(path.resolve(__dirname, "..", "publicKey.pem"), publicKey);
fs.writeFileSync(path.resolve(__dirname, "..", "privateKey.pem"), privateKey);
