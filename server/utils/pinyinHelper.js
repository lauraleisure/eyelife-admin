const pinyin = require('pinyin');

const generatePInYin = (name) => {
    let pinyinList = pinyin(name, {
        heteronym: true,              // 启用多音字模式
        segment: true                 // 启用分词，以解决多音字问题。
    });

    let py_out = '';
    pinyinList.forEach(it => {
        py_out += it;
    });
    return py_out;
};


module.exports = {
    generatePInYin
};
