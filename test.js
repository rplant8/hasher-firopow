'use strict'

const progpow = require('./index.js');

process.title = 'verify-test';

// TODO: Current test values are note based on known valid values

const headerHashBuf = Buffer.from('63543d3913fe56e6720c5e61e8d208d05582875822628f483279a3e8d9c9a8b3', 'hex');
const nonceBuf = hexToLE('88a23b0033eb959b');
const blockHeight = 262523;

const expectedMixHash = '6bf2c9bce65047a5cc337d181e8c7141d3204587fde441fa8152ddece925db6e';
const expectedHash = '2021a1a9bb6e3a2a26ea5546c132b8410352caabbdf9337b3f9852cf7568f3b7';

// Hash data
const hashResult = hash(headerHashBuf, nonceBuf, blockHeight);

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