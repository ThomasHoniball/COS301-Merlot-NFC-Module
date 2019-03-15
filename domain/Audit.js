module.exports = class Audit {

    constructor(clientID,authenticationStatus,cardID, timestamp) {
        this.cardID = cardID;
        this.clientID = clientID;
        this.authenticationStatus = authenticationStatus;
        this.timestamp = timestamp;
    }

     insertAuditLog() {
        let sql = `INSERT INTO audit_table(client_id,timestamp,authentication_status,card_id) \
                   VALUES('${this.clientID}','${this.timestamp}',${this.authenticationStatus},'${this.cardID}')`;
        return sql;
    }

    static getAuditLogByTimeStamp(timestamp) {
        let sql = `SELECT * FROM audit_table WHERE timestamp = ${timestamp}`;
        return sql;
    }

    static getAuditLogByClientID(cID) {
        let sql = `SELECT * FROM audit_table WHERE client_id = ${cID}`;
        return sql;
    }

    static getAuditLogByCardID(cID) {
        let sql = `SELECT * FROM audit_table WHERE card_id = ${cID}`;
        return sql;
    }

    static getAuditLog() {
        console.log("Getting SQL");
        let sql = `SELECT * FROM audit_table`;
        return sql;
    }


};

