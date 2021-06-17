/** @module Transaction */
const express = require('express');
const config = require('config');
const mysql = require("mysql2/promise");
const Web3 = require('web3');
const Transaction = express.Router();

Transaction.route('/past')
/** /transaction/past endpoint to get past transaction count
 * @param {String} WalletAddress - Address to count transaction
 * @param {Int} networkID - Id of network according to database
 * @returns {Int} Result - Number of transaction 
 */
.post(async (req,res,next) => {
    try{
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);
        
        web3.eth.getTransactionCount(req.body.WalletAddress)
        .then(result => {
            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        })
        .catch((err) => next(err));
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});

Transaction.route('/pending')
/** /transaction/pending endpoint to get pending transaction
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - total pending transaction
 */
.post(async (req,res,next) => {
    try{
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);
        
        web3.eth.getPendingTransactions()
        .then(result => {
            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        })
        .catch((err) => next(err));
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});

Transaction.route('/hstry')
/** /transaction/hstry endpoint to get transaction history
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - total pending transaction
 */
.post(async (req,res,next) => {
     try{
        // const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        // var web3 = new Web3(web3url[0].network_url);
        
        var myAddr = req.body.WalletAddress;

        var [result] = await db.query(`SELECT thash FROM transactions where ( tto = "${myAddr}" or tfrom = "${myAddr}") and network_id = ${req.body.networkID};`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);

        
     }catch(err){
         res.status(err.status || 500);
         res.render('error');
     }
});

Transaction.route('/hstry/inc')
/** /transaction/hstry endpoint to get incoming transaction history
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - total pending transaction
 */
.post(async (req,res,next) => {
    try{        
        var myAddr = req.body.WalletAddress;

        var [result] = await db.query(`SELECT thash FROM transactions where tto = "${myAddr}" and network_id = ${req.body.networkID};`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);

        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
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

module.exports = Transaction;