const express = require('express');
require('dotenv').config();
const config = require('config');
const mysql = require("mysql2/promise");
const fetch = require('node-fetch');

var ECPair = require("bitcoinjs-lib").ECPair;
var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');

const DDBL = express.Router();

DDBL.route('/crtAdd')
.post((req,res,next) => {
    try{         
      fetch(`https://api.blockcypher.com/v1/${req.body.coin}/main/addrs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
      .then((account) => {
          console.log(account)
          db.query(`Insert into users (user_name, address, pvt_key) values ("${req.body.user_name}", "${account.address}","${account.private}");`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(account);
      })
      .catch((err) => next(err));
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
}
);

DDBL.route('/trans')
.post(
  async (req,res,next) => {
    // try{         
      var newtx = {
        inputs: [{addresses: [req.body.from]}],
        outputs: [{addresses: [req.body.to], 
        value: req.body.value}]
      };

      const keys = ECPair.fromPrivateKey(Buffer.from(req.body.PrivateKey, 'hex'));

      fetch(`https://api.blockcypher.com/v1/${req.body.coin}/main/txs/new`, {
        method: 'POST',
        body: JSON.stringify(newtx)
      }).then(res => res.json())
      .then(tmptx => {
          console.log(tmptx);
          // signing each of the hex-encoded string required to finalize the transaction
          tmptx.pubkeys = [];
          
          tmptx.signatures = tmptx.tosign.map(function (tosign, n) {
            tmptx.pubkeys.push(keys.publicKey.toString('hex'));
            const SIGHASH_ALL = 0x01;
            return bitcoin.script.signature.encode(
              keys.sign(new buffer.Buffer(tosign, "hex")),
              SIGHASH_ALL,
            ).toString("hex").slice(0, -2);
          });

          
          fetch(`https://api.blockcypher.com/v1/${req.body.coin}/test3/txs/send`, {
            method: 'POST',
            body: JSON.stringify(tmptx)
          }).then(res => res.json())
          .then(txhash => {
            console.log(txhash);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(txhash);
          });

         
      })
      .catch((err) => next(err));;
        
    // }catch(err){
    //     res.status(err.status || 500);
    //     res.render('error');
    // }
}
);

DDBL.route('/accinfo')
.post((req,res,next) => {
    try{         
      fetch(`https://api.blockcypher.com/v1/${req.body.coin}/main/addrs/${req.body.address}/balance`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
      .then((account) => {
          console.log(account)
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(account);
      })
      .catch((err) => next(err));
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
}
);

async function main(){
    db = await mysql.createConnection({
      host: config.get('db.host'),
      user: config.get('db.user'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      timezone: config.get('db.timezone'),
      charset: config.get('db.charset')
    });
}
main();

module.exports = DDBL;