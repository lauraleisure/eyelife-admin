module.exports = function (err, req, res, next) {
    //默认错误，统一返回500
    let output = {
        statusCode: -1,
        message: '500 - 服务器内部错误',
        error: true,
        code: 500
    };
    //rst 抛出的错误
    if (err.isManaged_Flag) {
        output.statusCode = err.statusCode;
        output.message = err.message;
        output.code = err.code;
        output.data = err.data || {};
    } else {
        //对于非预期错误将其打印供问题排查之用
        console.log(err);
    }

    res.status(output.code).send(output)
};
