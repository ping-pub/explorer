/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-16 00:20:19
 * @FilePath: \look-web\server\src\main.js
 */
// 环境配置
require('dotenv').config()
// 数据库
require('./base/mongodb.js')

var express = require('express');
var app = express();
app.use(express.json());

var router = express.Router();

// gzip
const compression = require('compression')
app.use(compression())

// ua
var useragent = require('express-useragent');
app.use(useragent.express());

// proxy
var proxy = require('http-proxy-middleware');
// 根据请求转发
app.use('/api*', proxy({
  target: 'https://lcd.nylira.net',
  changeOrigin: true,
  pathRewrite: {
    ['^/api']: ''
  },
  router: function (req) {
    return req.headers.server || 'https://lcd.nylira.net';
  }
}))


router.get('/', function (req, res, next) {
  var isMobile = req.useragent.isMobile
  console.log('移动端', isMobile)
  let render = isMobile ? 'm.html' : 'index.html'
  res.render(render);
});

router.get('/validator', function (req, res, next) {
  res.redirect('/#/validator');
});
router.get('/uptime', function (req, res, next) {
  res.redirect('/#/uptime');
});
router.get('/block', function (req, res, next) {
  res.redirect('/#/block');
});
router.get('/proposal', function (req, res, next) {
  res.redirect('/#/governance');
});

router.get('/parameter', function (req, res, next) {
  res.redirect('/#/parameter');
});

app.use('/', router);

// 路由
require('./base/router.js')(app)

var nunjucks = require('nunjucks')
nunjucks.configure('dist', {
  autoescape: true,
  express: app
});

// static cache
var path = require('path');
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: '1y',
  expires: '1y',
  Etag: false,
  lastModified: false
}));

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
