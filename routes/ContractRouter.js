/** @module Contract */
const express = require('express');
const config = require('config');
const mysql = require("mysql2/promise");
const Tx = require('@ethereumjs/tx').Transaction;
const Web3 = require('web3');
const Contract = express.Router();

Contract.route('/')
/** /Contract endpoint to a new token contract on a network
 * @param {String} account - Account address from which contract needs to be deployed 
 * @param {Object} abi - ABI code for the contract
 * @param {String} bytecode - bytecode for the contract
 * @param {String} PrivateKey - Private key of from address
 * @param {Int} networkID - Id of network according to database
 * @param {Int} gas - Value of gas limit
 * @param {Int} gasPrice - Price of gas
 * @returns {Object} Result - JSON object of new contract instance  
 */
.post(async (req,res,next) => {
    try{
        const [web3url] = await db.query(`SELECT network_url, chainid FROM network where id = ${req.body.networkID};`);
        const web3 = new Web3(web3url[0].network_url);
        
        web3.eth.accounts.wallet.add({
            privateKey: req.body.privateKey,
            address: req.body.account
        });
        const abi = req.body.abi;
        //Contract object and account info
        let deploy_contract = new web3.eth.Contract(abi);
        let account = req.body.account;

        // Function Parameter
        let payload = {
            data: req.body.bytecode
        }

        let parameter = {
            from: account,
            gas:  web3.utils.toHex(req.body.gas),
            gasPrice: web3.utils.toHex(req.body.gasPrice)   //web3.utils.toHex(web3.utils.toWei('30', 'gwei')) 
        }

        deploy_contract.deploy(payload).send(parameter)
        // .on('transactionHash', (transactionHash) => {
        //     console.log("TxHash: ", transactionHash);
        // }).on('receipt', (receipt) => {
        //     console.log("Address: ", receipt.contractAddress)
        // })
        .then(function(newContractInstance){
            console.log(newContractInstance.options.address) // instance with the new contract address
            //0x6D54128f2a5f2DB4778C31832AB20B92a221f396
            //0x053774faF8C21D099CC5932E24D69639D706Ea35
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(newContractInstance.options);
        })
        .catch((err) => next(err));

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

module.exports = Contract;

