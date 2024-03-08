require("dotenv").config();
const DataBaseConnection = require("./db/conn");
const express=require("express");

const app=express();
const cors = require("cors");

const port= process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./routes/auth.route.js");
const userRouter = require("./routes/user.route.js");
const tweetRouter = require("./routes/tweet.route.js");



app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/tweet",tweetRouter);


app.get("/", (req, res) => {
    res.send("api is working");
  });
  

DataBaseConnection()
  .then((connection) => {
    app.listen(port, () => {
      console.log(`app is running on port no ${port}`);
    });
  })
  .catch((error) => console.log(error));