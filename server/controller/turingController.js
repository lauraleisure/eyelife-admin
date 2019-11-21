const Turing = require('../modules/Turing_Module');

module.exports = {

    turingReply: function (req, res, next) {
        const txt = req.body.txt;
        const turing = new Turing();
        return turing.xidianTuring(txt).then((data) =>
            res.json(turing.success('获取数据成功!', data).toObj())
        ).catch((err) =>
            next(err, req, res)
        )
    },



};
