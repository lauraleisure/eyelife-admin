const AdminModule = require('../modules/Admin_Module');
const TouristRouteModule = require('../modules/TouristRoute_Module');
const TopicRouteModule = require('../modules/Topic_Module.js');
const ScenicModule = require('../modules/Scenic_Module');
const ScenicCategoriesModule = require('../modules/ScenicCategories_Module');
const Token = require('../modules/Token_Module');
const Candidate = require('../modules/Candidate_Module');
const TouristOrder = require('../modules/TouristOrder_Module');
const TouristProfile = require('../modules/TouristProfile_Module');

module.exports = {
    login: function (req, res, next) {
        let username = req.body.username,
            password = req.body.password;
        const admin = new AdminModule();

        if (!username || !password) return res.status(400).json(admin.error('缺少参数', 400000));
        return admin.login(username, password, req)
            .then(user => res.json(admin.success('登录成功!', user).toObj()))
            .catch(err => next(err, req, res))
    },

    logout: function (req, res, next) {
        const _token = new Token();
        let currentToken = req.user.currentToken;
        return _token.removeToken(currentToken)
            .then(() => res.json(_token.success('退出成功!', null).toObj()))
            .catch(err => next(err, req, res))
    },

    createUser: function (req, res, next) {
        const admin = new AdminModule();
        let username = req.body.username,
            password = req.body.password,
            role_id = req.body.role_id || '5d5a115b23e41b5ab36edf21';

        if (!username || !password) return res.status(400).json(admin.error('缺少参数', 400000));
        if (!admin.isValidObjectId(role_id)) return res.status(400).json(admin.error('参数格式不正确', 400000));
        return admin.createUser(username, password, admin.ObjectId(role_id))
            .then(user => res.json(admin.success('创建用户成功!', user).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    getUserList: function (req, res, next) {
        let filter = req.body || req.params;
        const admin = new AdminModule();

        return admin.getUserList(filter)
            .then(data => res.json(admin.success('获取用户列表成功!', data).toObj()))
            .catch(err => next(err, req, res))
    },

    updateUser: function (req, res, next) {
        const admin = new AdminModule();
        let _id = req.params.id,
            data = req.body;

        if (!_id) return res.status(400).json(admin.error('缺少参数', 400000));
        return admin.updateUser(_id, data).then(info => res.json(admin.success('修改用户成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    createTouristRoute: function (req, res, next) {
        const touristRoute = new TouristRouteModule();
        let data = req.body;
        return touristRoute.createTouristRoute(data)
            .then(info => res.json(touristRoute.success('创建旅游路线成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    getTouristRoutesList: function (req, res, next) {
        let filter = req.body || req.params;
        const touristRoute = new TouristRouteModule();

        return touristRoute.getTouristRoutesList(filter)
            .then(data => res.json(touristRoute.success('获取线路列表成功!', data).toObj()))
            .catch(err => next(err, req, res))
    },

    //获取活动列表
    getTopicRoutesList: function (req, res, next) {
        let filter = req.body || req.params;
        let topic_type = req.params.topic_type;
        const topicRoute = new TopicRouteModule();
        return topicRoute.getTopicListPc(filter, topic_type)
            .then(data => res.json(topicRoute.success('获取活动列表成功!', data).toObj()))
            .catch(err => next(err, req, res))
    },

    //添加活动
    createTopicRoute: function (req, res, next) {
        let data = req.body;
        const topicRoute = new TopicRouteModule();
        return topicRoute.createTopic(data)
            .then(data => res.json(topicRoute.success('创建活动列表成功!', data).toObj()))
            .catch(err => next(err, req, res))
    },
    //修改活动
    updateTopicRoute: function (req, res, next) {
        const topicRoute = new TopicRouteModule();
        let _id = req.params.id;
        let data = req.body;
        if (!_id) return res.status(400).json(topicRoute.error('缺少参数', 400000));
        return topicRoute.updateTopicRoute(_id, data).then(info => res.json(topicRoute.success('修改活动成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    //获取活动id对应的详情数据
    getTopicDeatils: function (req, res, next) {
        const topicRoute = new TopicRouteModule();
        let _id = req.params.id;
        if (!_id) return res.status(400).json(topicRoute.error('缺少参数', 400000));
        return topicRoute.getTopicDetail(_id).then(info => res.json(topicRoute.success('获取活动详情成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    //获取活动商户和对应描述列表(group)
    getTopicScenicdescribe: function (req, res, next) {
        const topicRoute = new TopicRouteModule();
        let _id = req.params.id;
        if (!_id) return res.status(400).json(topicRoute.error('缺少参数', 400000));
        return topicRoute.TopicScenicdescribe(_id).then(info => res.json(topicRoute.success('获取活动商户和对应描述列表!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },
    //获取活动商户二维码列表(coupon)
    getQrcode: function (req, res, next) {
        const topicRoute = new TopicRouteModule();
        let _id = req.params.id;
        if (!_id) return res.status(400).json(topicRoute.error('缺少参数', 400000));
        return topicRoute.TopicQrcode(_id).then(info => res.json(topicRoute.success('获取活动商户二维码列表!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },


    //获取活动总条数
    getTopicCount: function (req, res, next) {
        let filter = req.body || req.params;
        const topicRoute = new TopicRouteModule();
        return topicRoute.getTopicCount(filter).then(function (data) {
            return res.json(topicRoute.success('获取活动总条数成功 !', data).toObj());
        }).catch(function (err) {
            next(err, req, res);
        }).done();
    },

    updateTouristRoute: function (req, res, next) {
        const touristRoute = new TouristRouteModule();
        let _id = req.params.id,
            data = req.body;

        if (!_id) return res.status(400).json(touristRoute.error('缺少参数', 400000));
        return touristRoute.updateTouristRoute(_id, data).then(info => res.json(touristRoute.success('修改旅游路线成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    createScenic: function (req, res, next) {
        const scenic = new ScenicModule();
        let data = req.body;
        return scenic.createScenic(data)
            .then(info => res.json(scenic.success('添加景点成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    getScenicsList: function (req, res, next) {
        let filter = req.body || req.params;
        const scenic = new ScenicModule();

        return scenic.getScenicList(filter)
            .then(data => res.json(scenic.success('获取景点列表成功!', data).toObj()))
            .catch(err => next(err, req, res))
    },

    updateScenic: function (req, res, next) {
        const scenic = new ScenicModule();
        let _id = req.params.id,
            data = req.body;

        if (!_id) return res.status(400).json(scenic.error('缺少参数', 400000));
        return scenic.updateScenic(_id, data).then(info => res.json(scenic.success('修改景点成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    createScenicCategory: function (req, res, next) {
        const scenicCategory = new ScenicCategoriesModule();
        let data = req.body;
        return scenicCategory.createScenicCategory(data)
            .then(info => res.json(scenicCategory.success('添加景点类别成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    getScenicCategoriesList: function (req, res, next) {
        let filter = req.body || req.params;
        const scenicCategories = new ScenicCategoriesModule();

        return scenicCategories.getScenicCategoriesList(filter)
            .then(data => res.json(scenicCategories.success('获取景点类别列表成功!', data).toObj()))
            .catch(err => next(err, req, res))
    },

    updateScenicCategory: function (req, res, next) {
        const scenicCategory = new ScenicCategoriesModule();
        let _id = req.params.id,
            data = req.body;

        if (!_id) return res.status(400).json(scenicCategory.error('缺少参数', 400000));
        return scenicCategory.updateScenicCategory(_id, data).then(info => res.json(scenicCategory.success('修改景点类别成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    addCandidator: function (req, res, next) {
        let cd = new Candidate();
        let topicId = req.params.topicid;
        let data = req.body;
        return cd.createCandidator(topicId, data)
            .then(d => res.json(cd.success('ok!', d).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    //根据topicId查询候选人列表
    queryCandidator: function (req, res, next) {
        let cd = new Candidate();
        let topicId = req.params.topicid;
        return cd.queryCandidator(topicId)
            .then(d => res.json(cd.success('ok!', d).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },


    topicScenicList: function (req, res, next) {
        const scenic = new ScenicModule();
        let {
            pagesize,
            pagecount,
            content
        } = req.body;

        pagesize = !isNaN(pagesize) ? parseInt(pagesize) : 20;
        pagecount = !isNaN(pagecount) ? parseInt(pagecount) : 1;

        return scenic.topicScenicList(pagesize, pagecount, content)
            .then(info => res.json(scenic.success('修改景点成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    addDiscountTopic: function (req, res, next) {
        let scenicId = req.params.scenicid;
        let updata = req.body;

        const scenic = new ScenicModule();
        return scenic.updateScenic(scenicId, updata)
            .then(info => res.json(scenic.success('修改景点成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    deleteScenicTopic: function (req, res, next) {
        let scenicId = req.params.scenicid;

        const scenic = new ScenicModule();
        return scenic.deleteScenicTopic(scenicId)
            .then(info => res.json(scenic.success('修改景点成功!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },

    appointmentNumList: function (req, res, next) {
        const to = new TouristOrder();
        return to.payList()
            .then(info => res.json(to.success('ok!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })

    },

    dateAppointmentNum: function (req, res, next) {
        const to = new TouristOrder();
        let {
            date
        } = req.query;
        return to.datePayNum(date)
            .then(info => res.json(to.success('ok!', info).toObj()))
            .catch(err => {
                next(err, req, res)
            })
    },


    touristDiscountList: function (req, res, next) {
        let tp = new TouristProfile();
        let {
            pagesize,
            pagecount,
            content,
        } = req.body;

        pagecount = !isNaN(pagecount) ? parseInt(pagecount) : 1;
        pagesize = !isNaN(pagesize) ? parseInt(pagesize) : 20;

        return tp.profileList(pagecount, pagesize, content)
            .then(info => res.json(tp.success('ok!', info).toObj()))
            .catch(err => next(err, req, res))
            .done(() => tp = null)
    },

    createDiscount: function (req, res, next) {
        let tp = new TouristProfile();
        let data = req.body;

        return tp.createProfile(data)
            .then(info => res.json(tp.success('ok!', info).toObj()))
            .catch(err => next(err, req, res))
            .done(() => tp = null)
    },

    discountDetail: function (req, res, next) {
        let tp = new TouristProfile();
        let id = req.params.id;

        return tp.profileDetail(id)
            .then(info => res.json(tp.success('ok!', info).toObj()))
            .catch(err => next(err, req, res))
            .done(() => tp = null)
    },

    updateDiscount:function (req, res, next) {
        let tp = new TouristProfile();
        let id = req.params.id;
        let data = req.body;

        return tp.updateProfile(id, data)
            .then(info => res.json(tp.success('ok!', info).toObj()))
            .catch(err => next(err, req, res))
            .done(() => tp = null)
    },

    deleteDiscount: function (req, res, next) {
        let tp = new TouristProfile();
        let id = req.params.id;

        return tp.removeOne(id)
            .then(info => res.json(tp.success('ok!', info).toObj()))
            .catch(err => next(err, req, res))
            .done(() => tp = null)
    }


};
