import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {//加密
  encrypt(word, keyStr){
    var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
  },
  //解密
  decrypt(word, keyStr){
    var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  randomKey() {  
    let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210';
    let key = '';
    for (var i = 0; i < 16; i++) {
      key += str.charAt(Math.floor(Math.random() * str.length));
    }
    return key;
  },
  Request(key, encryptData) {
    this.key = key;
    this.encryptData = encryptData;
  }
}