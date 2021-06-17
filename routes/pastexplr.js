const express = require('express');
require('dotenv').config();
const config = require('config');
const mysql = require("mysql2/promise");
const Tx = require('@ethereumjs/tx').Transaction;
const Web3 = require('web3');
const pastexplr = express.Router();

pastexplr.route('/')
.post( async (req, res, next) => {
    const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
          var web3 = new Web3(web3url[0].network_url);
          
          var currentBlock = await web3.eth.getBlockNumber();
          console.log(currentBlock);

          for (var i=0 ; i <= currentBlock ; i++) {
              try {
                  var block = await web3.eth.getBlock(i, true);
                  if (block && block.transactions) {
                      block.transactions.forEach(async (e) => {
                        //   console.log(e);
                          var [val] = await db.query(`Select * from transactions where thash = "${e}"`);
                          if(val.length==0)
                            db.query(`Insert into transactions (thash, tfrom, tto, network_id) values ("${e.hash}", "${e.from}","${e.to}", 3);`);
                      });
                  }
              } catch (e) { console.error( e); }
          }
    res.render('index', { title: 'Working on stuff' });
  });

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

module.exports = pastexplr;