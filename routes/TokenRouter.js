/** @module Token  */
const express = require('express');
require('dotenv').config();
const config = require('config');
const mysql = require("mysql2/promise");
const Tx = require('@ethereumjs/tx').Transaction;
const Web3 = require('web3');
const Token = express.Router();

Token.route('/')
/** /token endpoint to check token balance of a wallet address
 * @param {String} Symbol - token symbol to get other data from DB 
 * @param {String} WalletAddress - Address to check balaance from
 * @param {Int} networkID - Id of network according to database
 * @returns {Int} Result - Token balance 
 */
.post(async (req,res,next) => {
    try{
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);

        const [conAdd] = await db.query(`SELECT decimals, token_contract_address, token_abicode FROM tokendetails where token_symbol = "${req.body.Symbol}";`);
        let tokenAddress = conAdd[0].token_contract_address;
        let WalletAddress = req.body.WalletAddress;
        let ABI = eval(conAdd[0].token_abicode);
        const decimals = Math.pow(10,-1*conAdd[0].decimals);

        // Get ERC20 Token contract instance
        let contract = new web3.eth.Contract(ABI,tokenAddress);

        
        contract.methods.balanceOf(WalletAddress).call()
        .then(function (result) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result*decimals);
            console.log(result);
        })
        .catch((err) => next(err));
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});

Token.route('/trans')
/** /token endpoint to transfer token balance
 * @param {String} Symbol - token symbol to get other data from DB 
 * @param {String} to - Wallet address to trasfer funds to
 * @param {String} from - Wallet address to transfer funds from
 * @param {String} WalletAddress - Address to check balaance from
 * @param {Int} value - Amount of funds to be transfered
 * @param {Int} gas - Gas limit to be used
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object of transaction summary 
 */
.post(async (req,res,next) => {
    // try{
        const [web3url] = await db.query(`SELECT network_url, chainid FROM network where id = ${req.body.networkID};`);
        const web3 = new Web3(web3url[0].network_url);
        const networkId = await web3.eth.net.getId();
        const [conAdd] = await db.query(`SELECT token_contract_address, token_abicode FROM tokendetails where token_symbol = "${req.body.Symbol}";`);
        const token_contract_address = conAdd[0].token_contract_address;
        const from = req.body.from;
        const ABI = eval(conAdd[0].token_abicode);
        const to = req.body.to;
        
        // Get ERC20 Token contract instance
        const contract = new web3.eth.Contract(ABI,token_contract_address);

        const data = contract.methods.transfer(to, req.body.value).encodeABI();

        const rawTransaction = {
            from: from,
            nonce: web3.utils.toHex(web3.eth.getTransactionCount(from)),
            gasPrice: 1,
            gasLimit: req.body.gas,
            to: token_contract_address,
            value: 0,
            data: data,
            chainId: web3.utils.toHex(web3url[0].chainid)
        };

        const privateKey = new Buffer.from(req.body.PrivateKey, 'hex');
        const tx = new Tx(rawTransaction);
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction(('0x' + serializedTx.toString('hex'))) 

        // const signed = await web3.eth.accounts.signTransaction(rawTransaction, req.body.PrivateKey);
        // web3.eth.sendSignedTransaction(signed.rawTransaction)
        .then(function (result) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result*decimals);
            console.log(result);
        })
        .catch((err) => next(err));
    // }catch(err){
    //     res.status(err.status || 500);
    //     res.render('error');
    // }
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

module.exports = Token;