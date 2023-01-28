const express = require("express");
const connect = require("./config/db");
const bcrypt= require("bcrypt");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const { UsersModel } = require(`./modals/User.model`);
const {BmiModel} =require("./modals/Bmi.model.js")
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/",(req,res)=>{
res.send("hello people !");
});

app.post("/signup", async (req, res) => {
  const {name, email, password } = req.body;
  const Present = await UsersModel.findOne({ email });
  if (Present?.email) {
    res.send({ msg: "already exist" });
  } else {
    try {
      bcrypt.hash(password, 3, async function (err, hash) {
        const user = new UsersModel({ email, password: hash, name });
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
          res.send({ msg: "login Succesfull", token: token ,name: user[0].name});
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

app.post("/bmicalc", async(req,res)=>{
  const {height, weight, username} = req.body;
  const height_in_mtr = Number(height)/100
  const Bmi = Number(weight)/(height_in_mtr)**2
  const new_bmi = new BmiModel({
    Bmi,
    height: height_in_mtr,
    weight,
    username
  })
  await new_bmi.save()
  res.send({Bmi})
})

app.get("/profilebmi",async (req, res) => {
  const username = req.query.username;
  const bmi=await BmiModel.find({username: username})||0;
  res.send(bmi);
})




app.listen(process.env.PORT, async () => {
  try {
    await connect;
    console.log("db connected succesfull");
  } catch (err) {
    console.log("db connectection fail");
    console.log(err);
  }
});


