const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.connect(`mongodb://${process.env.Mongodb_url}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.Mongodb_user,
  pass: process.env.Mongodb_pwd,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("[dingyi]小芒果连上了~~");
});
