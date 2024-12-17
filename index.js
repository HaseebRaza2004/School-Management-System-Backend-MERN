import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
    console.log("req =>", req);
    res.send("First Api Succesfully fetched");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));