'use strict'

const progpow = require('./index.js');

process.title = 'verify-test';

// TODO: Current test values are note based on known valid values

const headerHashBuf = Buffer.from('63543d3913fe56e6720c5e61e8d208d05582875822628f483279a3e8d9c9a8b3', 'hex');
const nonceBuf = hexToLE('88a23b0033eb959b');
const blockHeight = 262523;

const expectedMixHash = '3414b7c3105a45426e56e6f4c800f4358334cc7df74d98141bb887185166436d';
const expectedHash = '717e7b6181ac3feb159059eca5080039df5676190a5f80a44d40e7c37d364126';

// Hash data
const hashResult = hash(headerHashBuf, nonceBuf, blockHeight);

// Verify mix hash mismatch detection
verifyMixHashDetect(hashResult.mixHashBuf);

// Verify mix hash
verify(hashResult.mixHashBuf, hashResult.hash, 1000);



console.log('Test completed successfully.');


function hash(headerHashBuf, nonceBuf, blockHeight) {

    const mixOutBuf = Buffer.alloc(32, 0);
    const hashOutBuf = Buffer.alloc(32, 0);

    progpow.hashOne(headerHashBuf, nonceBuf, blockHeight, mixOutBuf, hashOutBuf);

    const mixHash = mixOutBuf.toString('hex');
    const hash = hashOutBuf.toString('hex');

    console.log(`Mix Hash: ${mixHash}`);
    console.log(`Expected: ${expectedMixHash}\n`);
    console.log(`Hash:     ${hash}`);
    console.log(`Expected: ${expectedHash}\n`);

    if (mixHash !== expectedMixHash)
        throw new Error(`Got invalid mix hash. Expected ${expectedMixHash}`);

    if (hash !== expectedHash)
        throw new Error(`Got invalid hash. Expected ${expectedHash}`);

    return {
        mixHashBuf: mixOutBuf,
        hash: hash
    };
}


function verify(mixHashBuf, expectedHash, iterations) {

    console.log(`Verifying with ${iterations} iterations...`);

    const verifyHashOutBuf = Buffer.alloc(32);
    const startTimeMs = Date.now();

    for (let i = 0; i < iterations; i++) {
        const isValid = progpow.verify(headerHashBuf, nonceBuf, blockHeight, mixHashBuf, verifyHashOutBuf);
        if (!isValid)
            throw new Error('Verification failed.');
    }

    const endTimeMs = Date.now();

    const verifiedHash = verifyHashOutBuf.toString('hex');
    console.log(`Verified Hash: ${verifiedHash}`)
    if (verifiedHash !== expectedHash)
        throw new Error(`Verified hash output does not match original hash.`);

    const verifyPs = iterations / (endTimeMs - startTimeMs) * 1000;
    console.log(`verify/sec = ${verifyPs}\n`);
}


function verifyMixHashDetect(mixHashBuf) {

    const mixHashMisBuf = Buffer.alloc(mixHashBuf.length);
    mixHashBuf.copy(mixHashMisBuf);

    mixHashMisBuf[0]++;

    console.log(`Verifying mix hash mismatch detection`);
    console.log(`mixHashBuf: ${mixHashBuf.toString('hex')}`);
    console.log(`mixHashMisBuf: ${mixHashMisBuf.toString('hex')}`);

    const verifyHashOutBuf = Buffer.alloc(32);

    const isValid = progpow.verify(headerHashBuf, nonceBuf, blockHeight, mixHashMisBuf, verifyHashOutBuf);
    if (isValid)
        throw new Error('Verification failed to detect mixHash mismatch.');

    console.log('Mismatch successfully detected.')
}


function hexToLE(hex) {
    return reverseBytes(Buffer.from(hex, 'hex'));
}


function reverseBytes(buffer, output) {
    output = output || buffer;
    const halfLen = buffer.length / 2;
    for (let i = 0; i < halfLen; i++) {
        const byte = buffer[i];
        output[i] = buffer[buffer.length - i - 1];
        output[buffer.length - i - 1] = byte;
    }
    return output;
}