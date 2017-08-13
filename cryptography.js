const Promise = require("bluebird");
const crypto = require("crypto");
const readFile = Promise.promisify(require("fs").readFile);
const pbkdf2 = Promise.promisify(crypto.pbkdf2);
const randomBytes = Promise.promisify(crypto.randomBytes);

(async () => {
  try{
    const public_key = await readFile("./public_key", "utf8");
    const private_key = await readFile("./private_key", "utf8");

    // signing message
    const message = "Hi there boo";
    console.log("message: " + message);

    // sign the hard way (sha256 + RSA)
    const hash = crypto.createHash("sha256").update(message).digest("hex");
    const digestInfo = Buffer.from("3031300d060960864801650304020105000420" + hash, "hex"); // DigestInfo https://tools.ietf.org/html/rfc3447#section-9.2
    const signature = crypto.privateEncrypt({key: private_key, passphrase: "thepassword"}, digestInfo).toString("base64");
    console.log("signature sha256 + RSA: " + signature);

    // sign the easy way (RSA-SHA256)
    const cryptosignature = crypto.createSign("RSA-SHA256").update(message).sign({key: private_key, passphrase: "thepassword"}, "base64");
    console.log("signature == RSA-SHA256: " + (signature === cryptosignature));

    // verify the hard way
    const verification = crypto.publicDecrypt({key: public_key}, Buffer.from(signature, "base64"));
    const decrypted = verification.toString("hex").slice(38); // remove the DigestInfo

    console.log("verify RSA + sha256: " + (decrypted === hash));

    // verify the easy way
    const cryptovalid = crypto.createVerify("RSA-SHA256").update(message).verify(public_key, signature, "base64");
    console.log("verify RSA-SHA256: " + cryptovalid);

    // encrypting "small" message with RSA
    const ciphertext = crypto.publicEncrypt({key: public_key}, Buffer.from(message)).toString("base64");
    console.log("cyphertext: " + ciphertext);
    const plaintext = crypto.privateDecrypt({key: private_key, passphrase: "thepassword"}, Buffer.from(ciphertext, "base64")).toString("utf8");
    console.log("plaintext: " + plaintext);


    // encrypting "large" message with RSA
    // generate random symmetric key
    const key = (await randomBytes(32)).toString("hex");
    // encrypt key with RSA
    const cipherkey = crypto.publicEncrypt({key: public_key}, Buffer.from(key, "utf8")).toString("base64");

    // encrypt message with symmetric key
    const encrypt = crypto.createCipher("aes256", key);
    const cipherpoem = encrypt.update(await readFile("./poem.txt", "utf8"), "utf8", "base64") + encrypt.final("base64");

    // encrypted key + message
    const encrypted = {
      cipherkey: cipherkey,
      ciphertext: cipherpoem
    };

    console.log(encrypted);

    // decrypt key with RSA
    const plainkey = crypto.privateDecrypt({key: private_key, passphrase: "thepassword"}, Buffer.from(encrypted.cipherkey, "base64")).toString("utf8");
    // decrypt message
    const decrypt = crypto.createDecipher("aes256", plainkey);
    const plainpoem = decrypt.update(encrypted.ciphertext, "base64", "utf8") + decrypt.final("utf8");
    console.log("plainpoem: " + plainpoem)


  }catch(error){
    console.error(error);
  }
})();
