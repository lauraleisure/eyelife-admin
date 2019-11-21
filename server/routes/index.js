const router = require('express').Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const adminCtrl = require('../controllers/adminController');
const turingCtrl = require('../controllers/turingController');




router.get('/appointment/tourist/list', adminCtrl.appointmentNumList); //todo  待web登录接入后移入admin　router

router.get('/appointment/tourist/date/list', adminCtrl.dateAppointmentNum); //todo  待web登录接入后移入admin　router


router.use('/api/xcx', require('./xcxRouter'));
router.use('/api/admin', authMiddleware, require('./adminRouter'));
r

//图灵机器人专用接口
router.post('/turing/reply', jwtMiddleware, turingCtrl.turingReply);


module.exports = router;
