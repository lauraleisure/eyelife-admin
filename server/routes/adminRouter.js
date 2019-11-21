const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

//管理员注册
router.post('/register', adminCtrl.createUser);

//管理员登录
router.post('/login', adminCtrl.login);
router.post('/logout', adminCtrl.logout);

router.post('/user/list', adminCtrl.getUserList);

router.post('/user/update/:id', adminCtrl.updateUser);






module.exports = router;
