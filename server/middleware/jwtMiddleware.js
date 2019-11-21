const tools = require("../utils/tools");
const Rst = require('../modules/Rst_Module');


module.exports = (req, res, next) => {
    const tpAuth = req.get("Authorization");
    if (req.query.jwt || tpAuth) {
        const jwt = req.query.jwt;
        if (!jwt && tpAuth) {
            let tpAuArr = tpAuth.split(" ");
            let tpAuH = tpAuArr[0];
            let tpAuT = tpAuArr[1];
            if (tpAuH == "Jwt" && tpAuT) {
                tools.verifyJwtToken(tpAuT, function (err, data) {
                    if (err) next(err);
                    next();
                });
            } else {
                // next(new Rst().error("Bad Jwt Token"))
                res.status(401).send("unauthorized!");
            }
        } else {
            tools.verifyJwtToken(req.query.jwt, function (err, data) {
                if (err) next(err);
                next();
            });
        }
    } else {
        // next(new Rst().error('JWT Not Found'));
         res.status(401).send("unauthorized!");
    }
};
