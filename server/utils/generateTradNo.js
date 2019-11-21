"use strict";

const moment = require('moment');


const generateNo = () => {
    return moment().format('x') + Math.random().toString().substr(2, 10);
};

const generateTradNo = () => {
    return 'TOUR' + generateNo();
};

const generateTrainTradNO = () => {
    return 'TRAIN' + generateNo();
};

module.exports = {
    generateTradNo,
    generateTrainTradNO
};
