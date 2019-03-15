var bodyparser = require("body-parser");
var auditLog = require("./api/auditLog");
var express =  require("express");
var cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());


app.use("/audit",auditLog);

//if we are here then the specified request is not found
app.use((req,res,next)=> {
    console.log("404 not found");
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

//all other requests are not implemented.
app.use((err,req, res, next) => {
   res.status(err.status || 501);
   res.json({
       error: {
           code: err.status || 501,
           message: err.message
       }
   });
});

module.exports = app;