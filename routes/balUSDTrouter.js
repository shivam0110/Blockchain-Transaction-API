const express = require('express');
require('dotenv').config();
const keccak_256 = require('js-sha3').keccak256
const fetch = require('node-fetch');
const USDTbal = express.Router();


USDTbal.route('/')
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