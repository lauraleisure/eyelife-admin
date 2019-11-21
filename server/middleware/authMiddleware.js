const TokenModule = require("../modules/Token_Module");
const AdminModule = require('../modules/Admin_Module');

module.exports = (req, res, next) => {
    if (req.headers.authorization != null) {
        let authArr = req.headers.authorization.split(' ');
        let authH = authArr[0];
        let authT = authArr[1];
        if (authH == 'Bearer' && authT) {
            const _token = new TokenModule();
            return _token.verifyToken(authT)
                .then(function (token) {
                    const admin = new AdminModule();
                    return admin.adminUser(token.userID._id)
                        .then(user => {
                            user = user.toObject();
                            user.currentToken = token.currentToken;
                            req.user = user;
                            next();
                        })
                })
                .catch(err => next(err, req, res))
        } else {
            return res.status(401).send("unauthorized!");
        }
    } else {
        return res.status(401).send("unauthorized!");
    }
};
