const express = require("express");
const logger = require("morgan");
const cors = require("cors");
//
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

//

const authRouter = require(`./routes/api/auth`);
app.use("/api/users", authRouter);
//

const contactsRouter = require("./routes/api/contacts");
app.use("/api/contacts", contactsRouter);
//

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ status: err.status, message: err.message });
});

module.exports = app;
