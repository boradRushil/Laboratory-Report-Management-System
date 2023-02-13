pki.rsa.decrypt = function(ed, key, pub, ml) {
    // get the length of the modulus in bytes
    var k = Math.ceil(key.n.bitLength() / 8);
  
    // error if the length of the encrypted data ED is not k
    if(ed.length !== k) {
      var error = new Error('Encrypted message length is invalid.');
      error.length = ed.length;
      error.expected = k;
      throw error;
    }
  
    // convert encrypted data into a big integer
    // FIXME: hex conversion inefficient, get BigInteger w/byte strings
    var y = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
  
    // y must be less than the modulus or it wasn't the result of
    // a previous mod operation (encryption) using that modulus
    if(y.compareTo(key.n) >= 0) {
      throw new Error('Encrypted message is invalid.');
    }
  
    // do RSA decryption
    var x = _modPow(y, key, pub);
  
    // create the encryption block, if x is shorter in bytes than k, then
    // prepend zero bytes to fill up eb
    // FIXME: hex conversion inefficient, get BigInteger w/byte strings
    var xhex = x.toString(16);
    var eb = forge.util.createBuffer();
    var zeros = k - Math.ceil(xhex.length / 2);
    while(zeros > 0) {
      eb.putByte(0x00);
      --zeros;
    }
    eb.putBytes(forge.util.hexToBytes(xhex));
  
    if(ml !== false) {
      // legacy, default to PKCS#1 v1.5 padding
      return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
    }
  
    // return message
    return eb.getBytes();
  };
  