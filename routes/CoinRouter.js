/** @module Coin */
const express = require('express');
// require('dotenv').config();
const config = require('config');
// const fetch = require('node-fetch');
const mysql = require("mysql2/promise");
const Web3 = require('web3');
const Coin = express.Router();

Coin.route('/')
/** /coin endpoint to check balance of a particular coin
 * @param {string} WalletAddress - Address of the wallet to check balance of
 * @param {int} networkID - Id of network according to database
 * @returns {number} value - Amount in wallet address or error 
 */
.post(async (req,res,next) => {
    try{
        let WalletAddress = req.body.WalletAddress;
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);
        
        web3.eth.getBalance(WalletAddress)
        .then(async balance => {
            const gasPrice = await web3.eth.getGasPrice();
            const max_transferable = balance - (gasPrice * 21000);  
            result = {
                "balance": balance,
                "max_transferable": max_transferable
            }
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
})

Coin.route('/trans')
/** /coin/trans endpoint to transfer funds from a address to one or more address
 * @param {String array} to - Array of wallet address to trasfer funds to, can be 1 or more
 * @param {String} from - Wallet address to transfer funds from
 * @param {Int} value - Amount of funds to be transfered
 * @param {String} PrivateKey - Private key of from address
 * @param {int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object of transaction summary  
 */
.post(async (req,res,next) => {
    try{
        const n = (req.body.to).length;
        const result = [];
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);

        
            for(var i = 0; i<n; i++){            
                const createTransaction = await web3.eth.accounts.signTransaction({
                    from: req.body.from,
                    // nonce: web3.utils.toHex(web3.eth.getTransactionCount(req.body.from)),
                    to: req.body.to[i],
                    value: req.body.value,
                    gas: 21000,
                }, req.body.PrivateKey)
                .catch((err) => result.push(err));

                // console.log(createTransaction);

                await  web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
                .then(function (ans) {
                    result.push(ans);                
                })
                .catch((err) => console.log(err));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
            console.log(result);
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});


///////////////////////
Coin.route('/transblk')
/** /coin/trans endpoint to transfer funds from a address to one or more address
 * @param {String array} to - Array of wallet address to trasfer funds to, can be 1 or more
 * @param {String} from - Wallet address to transfer funds from
 * @param {Int} value - Amount of funds to be transfered
 * @param {String} PrivateKey - Private key of from address
 * @param {int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object of transaction summary  
 */
.post(async (req,res,next) => {
    try{
        const n = (req.body.to).length;
        const x = (req.body.from).length;
        const result = [];
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);

        if(x < 2){
            for(var i = 0; i<n; i++){            
                const createTransaction = await web3.eth.accounts.signTransaction({
                    from: req.body.from[0],
                    // nonce: web3.utils.toHex(web3.eth.getTransactionCount(req.body.from)),
                    to: req.body.to[i],
                    value: req.body.value,
                    gas: 21000,
                }, req.body.PrivateKey[0])
                .catch((err) => result.push(err));

                // console.log(createTransaction);

                await  web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
                .then(function (ans) {
                    result.push(ans);                
                })
                .catch((err) => console.log(err));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
            console.log(result);
        }else{
            for(var i = 0; i<x; i++){            
                const createTransaction = await web3.eth.accounts.signTransaction({
                    from: req.body.from[i],
                    // nonce: web3.utils.toHex(web3.eth.getTransactionCount(req.body.from)),
                    to: req.body.to[0],
                    value: req.body.value,
                    gas: 21000,
                }, req.body.PrivateKey[i])
                .catch((err) => result.push(err));

                // console.log(createTransaction);

                await  web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
                .then(function (ans) {
                    result.push(ans);                
                })
                .catch((err) => console.log(err));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
            console.log(result);
        }
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});


Coin.route('/track')
.post(async (req,res,next) => {
    console.log("in track");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const [a] = await db.query(`SELECT * FROM network`);
    res.json(a);
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

module.exports = Coin;