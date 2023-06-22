import { CRYPTO_KEY } from "../constants";
import CryptoJS from "crypto-js";

const encrypt = (string: string) => {
  if (!string || string === '') {
    return null
  }
  let encrypted = CryptoJS.AES.encrypt(string, CRYPTO_KEY).toString();
  return encrypted;
}

const decrypt = (string: string) => {
  if (!string) {
    return ''
  }
  let bytes  = CryptoJS.AES.decrypt(string, CRYPTO_KEY);
  let decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

export { encrypt, decrypt }
