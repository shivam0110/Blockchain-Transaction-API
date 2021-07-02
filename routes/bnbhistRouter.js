const express = require('express');
const fetch = require('node-fetch');
const bnbhist = express.Router();
require('dotenv').config();


bnbhist.route('/')
.post((req,res,next) => {
    fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${req.body.address}&sort=asc&apikey=APIKEY`, {
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