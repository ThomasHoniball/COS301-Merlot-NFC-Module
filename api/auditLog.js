var express =  require("express");
var db = require("../db/database");
var Audit = require("../domain/Audit.js");
var moment = require("../moment");


const router = express.Router();

router.get("/", (req, res, next) => {
    console.log("Getting Product");
    db.query(Audit.getAuditLog(), (err, data) => {
        console.log("Called DB query");
        if(!err) {
            console.log("No Error");
            res.status(200).json({
                message:"Audit Log",
                productId:data
            });
        }
        else
        {
            console.log("ERROR")
        }
    });
});

router.post("/add", (req, res, next) => {
    console.log("In add route");
    //read product information from request

    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
let audit = new Audit(req.body.clientID,req.body.authenticationStatus,req.body.cardID,mysqlTimestamp);
console.log("Adding Log... CLientID: " + req.body.clientID);
    console.log("Adding Log... cardID: " + req.body.cardID);

    console.log("Adding Log... CLientID: " + req.body.authenticationStatus);

    db.query(audit.insertAuditLog(), (err, data)=> {
        res.status(200).json({
            message:"Audit added.",

        });
    });
});

router.get("/query/card/:cardId", (req, res, next) => {
    let cid = req.params.cardId;

    db.query(Audit.getAuditLogByCardID(cid), (err, data)=> {
        if(!err) {
            if(data && data.length > 0) {

                res.status(200).json({
                    message:"Card found.",
                    product: data
                });
            } else {
                res.status(200).json({
                    message:"Card Not found."
                });
            }
        }
    });
});

router.get("/query/client/:clientId", (req, res, next) => {
    let cid = req.params.clientId;

    db.query(Audit.getAuditLogByClientID(cid), (err, data)=> {
        if(!err) {
            if(data && data.length > 0) {

                res.status(200).json({
                    message:"Client found.",
                    product: data
                });
            } else {
                res.status(200).json({
                    message:"Client Not found."
                });
            }
        }
    });
});

router.get("/query/timestamp/:timestamp", (req, res, next) => {
    let ts = req.params.timestamp;

    db.query(Audit.getAuditLogByTimeStamp(ts), (err, data)=> {
        if(!err) {
            if(data && data.length > 0) {

                res.status(200).json({
                    message:"Log found.",
                    product: data
                });
            } else {
                res.status(200).json({
                    message:"Log Not found."
                });
            }
        }
    });
});



module.exports = router;