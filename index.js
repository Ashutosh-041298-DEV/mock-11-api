const express = require("express");
const connect = require("./config/db");
const jwt = require("jsonwebtoken");
const { UsersModel } = require(`../models/user.model`);
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const Present = await UsersModel.findOne({ email });
  if (Present?.email) {
    res.send({ msg: "already exist" });
  } else {
    try {
      bcrypt.hash(password, 3, async function (err, hash) {
        const user = new UsersModel({ email, password: hash });
        await user.save();
        res.send({ msg: "sign up successfull" });
      });
    } catch (err) {
      console.log(err);
      res.send({ msg: "sign up failed" });
    }
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UsersModel.find({ email });
    if (user.length > 0) {
      const hash_password = user[0].password;
      bcrypt.compare(password, hash_password, async function (err, result) {
        if (result) {
          const token = jwt.sign({ userId: user[0]._id }, "hush");
          res.send({ msg: "login Succesfull", token: token });
        } else {
          res.send({ msg: "Login Fail" });
        }
      });
    } else {
      res.send({ msg: "Login Fail" });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Login Fail" });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connect;
    console.log("db connected succesfull");
  } catch (err) {
    console.log("db connectection fail");
    console.log(err);
  }
});
