pki.rsa.encrypt = function(m, key, bt) {
    var pub = bt;
    var eb;
  
    // get the length of the modulus in bytes
    var k = Math.ceil(key.n.bitLength() / 8);
  
    if(bt !== false && bt !== true) {
      // legacy, default to PKCS#1 v1.5 padding
      pub = (bt === 0x02);
      eb = _encodePkcs1_v1_5(m, key, bt);
    } else {
      eb = forge.util.createBuffer();
      eb.putBytes(m);
    }
  
    // load encryption block as big integer 'x'
    // FIXME: hex conversion inefficient, get BigInteger w/byte strings
    var x = new BigInteger(eb.toHex(), 16);
  
    // do RSA encryption
    var y = _modPow(x, key, pub);
  
    // convert y into the encrypted data byte string, if y is shorter in
    // bytes than k, then prepend zero bytes to fill up ed
    // FIXME: hex conversion inefficient, get BigInteger w/byte strings
    var yhex = y.toString(16);
    var ed = forge.util.createBuffer();
    var zeros = k - Math.ceil(yhex.length / 2);
    while(zeros > 0) {
      ed.putByte(0x00);
      --zeros;
    }
    ed.putBytes(forge.util.hexToBytes(yhex));
    return ed.getBytes();
  };