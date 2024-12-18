import express from "express";
import morgan from "morgan";
import 'dotenv/config';
import mongoose from "mongoose";

const app = express();
const PORT = 4000;

app.use(morgan('tiny'));
app.use(express.json());

mongoose.connect(process.env.MONGODBURI)
    .then(() => console.log("mongoDB Connected Successfully"))
    .catch((error) => console.log("Error =>", error));

app.get("/", (req, res) => {
    console.log("req =>", req);
    res.send("First Api Succesfully fetched");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));