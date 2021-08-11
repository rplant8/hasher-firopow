hasher-progpow-firo
===================

This is a Node module for simple hashing and verifying inputs using the
Progpow proof-of-work algorithm as implemented by [Firo](https://github.com/firoorg/firo).
Most of the native code comes from or is adapted from [Ravencoin](https://github.com/RavenProject/Ravencoin) and [Firo](https://github.com/firoorg/firo) code.

This module has been developed and tested on [Node v10.16.3](https://nodejs.org/) and
[Ubuntu 16.04](http://releases.ubuntu.com/16.04/) for the [Firo mining pool](https://mintpond.com/#!/firo) at [MintPond](https://mintpond.com).

## Install ##
__Install as Dependency in NodeJS Project__
```bash
# Install from Github git package

sudo apt-get install build-essential
npm install mintpond/hasher-firopow --save
```
-or-
```bash
# Install from Github NPM repository

sudo apt-get install build-essential
npm config set @mintpond:registry https://npm.pkg.github.com/mintpond
npm config set //npm.pkg.github.com/:_authToken <MY_GITHUB_AUTH_TOKEN>

npm install @mintpond/hasher-firopow@0.1.1 --save
```

__Install & Test__
```bash
# Install nodejs v10
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs -y

# Download hasher-firopow
git clone https://github.com/MintPond/hasher-firopow

# build
cd hasher-firopow
sudo apt-get install build-essential
npm install

# test
npm test
``` 

## Usage ##
__Hash__
```javascript
const progpow = require('@mintpond/hasher-firopow');

const mixOutBuf = Buffer.alloc(32);
const hashOutBuf = Buffer.alloc(32);

/**
 * Hash using a single nonce and place results into the specified output Buffers.
 *
 * Note that all input values are expected to be in little-endian format.
 *
 * All output values are in little endian format
 *
 * @param headerHashBuf {Buffer} 32-byte header hash
 * @param nonceBuf {Buffer} 8-byte nonce value (64-bits)
 * @param blockHeight {number} Block height integer
 * @param mixOutBuf {Buffer} Mix hash result output Buffer
 * @param hashOutBuf {Buffer} Hash result output Buffer
 */
progpow.hashOne(headerHashBuf, nonceBuf, blockHeight, mixOutBuf, hashOutBuf);

console.log(mixHashBuf.toString('hex'));
console.log(hashOutBuf.toString('hex'));

```

__Verify__
```javascript
const progpow = require('@mintpond/hasher-firopow');

const hashValueOut = Buffer.alloc(32);

/**
 * Verify a mix hash.
 *
 * Note that all input values are expected to be in little-endian format.
 *
 * All output values are in little endian format.
 *
 * @param headerHashBuf {Buffer} 32-byte header hash
 * @param nonceBuf {Buffer} 8-byte nonce value (64-bits)
 * @param blockHeight {number} Block height integer
 * @param mixHashBuf {Buffer} Mix hash for verification
 * @param hashOutBuf {Buffer} Hash result output Buffer
 * @returns {boolean} True if valid, otherwise false.
 */
const isValid = progpow.verify(headerHashBuf, nonceBuf, blockHeight, mixHashBuf, hashValueOut);

if (isValid) {
    console.log(hashValueOut.toString('hex'));
}
else {
    console.log('Invalid');
}
```

## Dependencies ##
In Ubuntu:
```
   sudo apt-get install build-essential
```