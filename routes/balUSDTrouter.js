/** @module Balance_USDT */
const express = require('express');
require('dotenv').config();
const keccak_256 = require('js-sha3').keccak256
const fetch = require('node-fetch');
const USDTbal = express.Router();


USDTbal.route('/')
/** /USDTbal endpoint to get balance of USDT token or any other ERC20 token(acc to Contract address)
 * @param {string} BLOCK_PARAMETER - an integer block number, or the string "latest", "earliest" or "pending"
 * @param {string} ADDRESS - Address to get balance of
 * @param {string} ContractAddress - Contract address of ERC20 token of address to get balance of
 * @returns {Object} Result - JSON object of address's balance of given ERC2 token
 */
.get((req,res,next) => {
    const data = '0x' + keccak_256.hex('balanceOf(address)').substr(0, 8) + '000000000000000000000000' + req.body.ADDRESS.substr(2) // chop off the 0x
    var body = {
        "jsonrpc":"2.0",
        "method":"eth_call",
        "params": [{to: req.body.ContractAddress, data: data}, req.body.BLOCK_PARAMETER],
        "id":1
    }
    fetch(`https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(json => {
        console.log(json)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var balance = parseInt(json.result)
        res.json(balance/1000000);
    });
})


module.exports = USDTbal;