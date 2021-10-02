/** @module Addresses */
const express = require('express');
const config = require('config');
const mysql = require("mysql2/promise");
const Web3 = require('web3');
const address = express.Router();

address.route('/')
/** /address endpoint to take addresses from transaction and store them with corresponding network_id(given) in addresses table
 * @param {int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object of addresses to be stored in addresses table
 */
.post(async (req,res,next) => {
    try{
        const [transarray] = await db.query(`SELECT tto, tfrom FROM transactions where network_id = ${req.body.networkID};`);

        for (i in transarray) {
            insertadd(transarray[i].tto);
            insertadd(transarray[i].tfrom);
        }

        function insertadd (add){
            try{
                db.query(`Insert into addresses (address, network_id) values ("${add}", ${req.body.networkID})`);
            }catch(err){
                console.log(err);
            }
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({"result": "Working..."});
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
})

address.route('/bal')
/** /address/bal endpoint to get balance for all stored array in addresses table according to network_id(given)
 * @param {int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object of addresses and their balance
 */
.post(async (req,res,next) => {
    try{
        const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);

        var body = [];

        const [AddArray] = await db.query(`SELECT address FROM addresses where network_id = ${req.body.networkID};`);

        for (var i in AddArray) {
            await bal(AddArray[i].address);
        }
        
        async function bal (add){
            await web3.eth.getBalance(add)
            .then(balance => {
                body.push({"Address": add, "Balance": balance});
            })
            .catch((err) => console.log(err));        
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(body);
        
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

module.exports = address;