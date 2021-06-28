const express = require('express');
require('dotenv').config();
const config = require('config');
const mysql = require("mysql2/promise");
const RippleAPI = require('ripple-lib').RippleAPI;
const fetch = require('node-fetch');
const XRP = express.Router();

XRP.route('/crtAdd')
/** XRP/crtAdd endpoint to create a new address
 * @param {String} user_name - Name of user to store with the new account generated
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object containing new account information 
 */
.post(async (req,res,next) => {
    try{         
        const user_name = req.body.user_name;
        const [url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);

        const api = new RippleAPI({
            server: url[0].network_url // Public rippled server
        }); 
        api.connect().then(() => {
            /* begin custom code ------------------------------------ */
    
            return api.generateAddress();
          
        }).then(account => {
            console.log(account);
            db.query(`Insert into users (user_name, address, pvt_key, network_id) values ("${user_name}", "${account.address}","${account.secret}", ${req.body.networkID});`);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(account);
          
            /* end custom code -------------------------------------- */
        }).then(() => {
            return api.disconnect();
        }).then(() => {
            console.log('done and disconnected.');
        }).catch((err) => next(err));
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});


XRP.route('/trans')
.post(async (req,res,next) => {
    try{         
        const [url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);

        const api = new RippleAPI({
            server: url[0].network_url // Public rippled server
        }); 
        api.connect().then(async () => {
            /* begin custom code ------------------------------------ */
            const payment = {
                "source": {
                    "address": req.body.sender,
                    "maxAmount": {
                        "value": req.body.amount,
                        "currency": "XRP"
                        // "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
                    }
                },
                "destination": {
                    "address": req.body.reciever,
                    "amount": {
                        "value": req.body.amount,
                        "currency": "XRP"
                        // "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
                    }
                }
            };

            // Prepare the payment
            const preparedTX = await api.preparePayment(req.body.sender, payment);

            // Sign the payment
            const signedTX = api.sign(preparedTX.txJSON, req.body.secret);

            return api.submit(signedTX.signedTransaction);
          
        }).then(transaction => {
            console.log(transaction);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transaction);
          
            /* end custom code -------------------------------------- */
        }).then(() => {
            return api.disconnect();
        }).then(() => {
            console.log('done and disconnected.');
        }).catch((err) => next(err));
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
})


XRP.route('/getTrans')
/** XRP/getTrans endpoint to 
 * @param {String} user_name - Name of user to store with the new account generated
 * @param {Int} networkID - Id of network according to database
 * @returns {Object} Result - JSON object containing new account information 
 */
.post(async (req,res,next) => {
    try{         
        const [url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);

        const api = new RippleAPI({
            server: url[0].network_url // Public rippled server
        }); 
        api.connect().then(async () => {
            /* begin custom code ------------------------------------ */
            const serverInfo = await api.getServerInfo();
            const ledgers = serverInfo.completeLedgers.split('-');
            const minLedgerVersion = Number(ledgers[0]);
            const maxLedgerVersion = Number(ledgers[1]);
            const address = req.body.address;
            return api.getTransactions(address, {
                minLedgerVersion,
                maxLedgerVersion,
            });
          
        }).then(transaction => {
            console.log(transaction);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transaction);
          
            /* end custom code -------------------------------------- */
        }).then(() => {
            return api.disconnect();
        }).then(() => {
            console.log('done and disconnected.');
        }).catch((err) => next(err));
        
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});

XRP.route('/accInfo')
.post(async (req,res,next) => {
    try{         
        const user_name = req.body.user_name;
        const [url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);

        const api = new RippleAPI({
            server: url[0].network_url // Public rippled server
        }); 
        api.connect().then(() => {
            /* begin custom code ------------------------------------ */
    
            const address = req.body.address;
            return api.getAccountInfo(address);
          
        }).then(info => {
            console.log(info);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(info);
          
            /* end custom code -------------------------------------- */
        }).then(() => {
            return api.disconnect();
        }).then(() => {
            console.log('done and disconnected.');
        }).catch((err) => next(err));
        
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

module.exports = XRP;