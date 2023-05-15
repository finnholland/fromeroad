import { CRYPTO_KEY } from "../constants";
import CryptoJS from "crypto-js";

const encrypt = (string: string) => {
  let encrypted = CryptoJS.AES.encrypt(string, CRYPTO_KEY).toString();
  return encrypted;
}

const decrypt = (string: string) => {
  let bytes  = CryptoJS.AES.decrypt(string, CRYPTO_KEY);
  let decrypted = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decrypted)
  return decrypted;
}

export { encrypt, decrypt }
