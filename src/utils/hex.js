const hex = {
    hexToBytes(hex) {
      let bytes = [];
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
      }
      return bytes;
    },
  
    bytesToHex(bytes) {
      let hex = [];
      for (let i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join("").toUpperCase();
    },
  
    stringToHex(str){
      let bytes = [];
      for(var i = 0; i < str.length; i++){
        bytes.push(str.charCodeAt(i).toString(16));
      }
      return bytes.join("");
    },
  
    isHex(str){
      str = str.replace("0x","");
      return /^[0-9a-fA-F]*$/i.test(str);
    }
  };
  
  export default hex
