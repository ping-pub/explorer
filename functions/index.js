const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");

const apiApp = express();
const rpcApp = express();

// CORS設定
apiApp.use(cors({origin: true}));
rpcApp.use(cors({origin: true}));

// 環境変数からトークンを読み込み
const validToken = functions.config().sentry.token;

/**
 * トークン認証ミドルウェア
 * @param {*} req リクエスト
 * @param {*} res レスポンス
 * @param {*} next 次の処理
 * @return {void} なし
 */
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  if (token.split(" ")[1] !== validToken) {
    return res.sendStatus(403);
  }

  next();
}

// 認証ミドルウェアを追加
apiApp.use(authenticateToken);

apiApp.use((req, res) => {
  const sentryUrl = "http://95.179.253.169:14617" + req.path;
  const query = qs.stringify(req.query, {arrayFormat: "repeat"});
  axios({
    method: req.method,
    url: sentryUrl + (query ? `?${query}` : ""),
    data: req.body,
    headers: req.headers,
  })
      .then((response) => {
        res.status(response.status).send(response.data);
      })
      .catch((error) => {
        res.status(error.response ? error.response.status : 500)
            .send(error.message);
      });
});

rpcApp.use((req, res) => {
  const sentryUrl = "http://95.179.253.169:26657" + req.path;
  const query = qs.stringify(req.query, {arrayFormat: "repeat"});
  axios({
    method: req.method,
    url: sentryUrl + (query ? `?${query}` : ""),
    data: req.body,
    headers: req.headers,
  })
      .then((response) => {
        res.status(response.status).send(response.data);
      })
      .catch((error) => {
        res.status(error.response ? error.response.status : 500)
            .send(error.message);
      });
});

exports.proxyToSentryApi = functions.https.onRequest(apiApp);
exports.proxyToSentryRpc = functions.https.onRequest(rpcApp);
