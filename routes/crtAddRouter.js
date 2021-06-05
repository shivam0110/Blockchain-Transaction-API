/** @module Create-Address  */
const express = require('express');
const mysql = require("mysql2/promise");
const config = require('config');
const Web3 = require('web3');
const crtAddress = express.Router();

crtAddress.route('/')
/** /crtAdd endpoint to create a new address
 * @param {String} user_name - Name of user to store with the new account generated
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object containing new account information 
 */
.post(async (req,res,next) => {
    try{
        const user_name = req.body.user_name;
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);
        
        const account = web3.eth.accounts.create();
        console.log(account);
        db.query(`Insert into users (user_name, address, pvt_key, network_id) values ("${user_name}", "${account.address}","${account.privateKey}", ${req.body.networkID});`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(account);
        
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

module.exports = crtAddress;