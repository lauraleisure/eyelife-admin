'use strict';

const TokenModule = require("../modules/Token_Module");

const UserModule = require('../modules/User_Module');


module.exports = (req, res, next) => {
    const _token = new TokenModule();
    return _token.verifyTokenFromHeader(req.headers).then(function (token) {
        let _user = new UserModule();
        return _user.exchangeUserByToken(token.currentToken).then(user => {
            user = user.toObject ? user.toObject() : user;
            user.currentToken = token.currentToken;
            req.user = user;
            next();
        })
    }).catch(err => {
        // console.log(err);
        return res.status(401).send("unauthorized!");
    });
};
