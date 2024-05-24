const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// CORS設定
app.use(cors({origin: true}));

app.use((req, res) => {
  const sentryUrl = "http://95.179.253.169:14617" + req.path;
  axios({
    method: req.method,
    url: sentryUrl,
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

exports.proxyToSentry = functions.https.onRequest(app);
