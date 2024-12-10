const express = require("express");
const mainRouter=require("./routes/index");
const userRouter = require("./routes/user");
const accountRouter=require("./routes/account");
const app=express();
const cors=require("cors");
app.use(cors());
app.use(express.json());


app.use("/api/v1",mainRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/account",accountRouter);
app.listen(3000);