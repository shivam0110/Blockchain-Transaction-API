/** @module BNB_History */
const express = require('express');
const fetch = require('node-fetch');
const bnbhist = express.Router();
require('dotenv').config();


bnbhist.route('/')
/** /bnbhist endpoint to get transaction history for a given BNB coin address
 * @param {int} address - Address of BNB coin to get past transactions list of
 * @returns {Object} Result - JSON object of list of transactions of a BNB address
 */
.post((req,res,next) => {
    fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${req.body.address}&sort=asc&apikey=${process.env.apikey}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(transactions => {
        console.log(transactions)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(transactions);
    });
})


module.exports = bnbhist;