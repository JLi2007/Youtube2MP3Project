//Require and configurations
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

//process.env.PORT is for deployment purposes (Heroku)
const PORT = process.env.PORT || 5000;

//set template engine (ejs)
app.set("view engine", "ejs");

app.use(express.static("public"));

//parse html data for POST request
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/convert-mp3", async(req, res) => {
    //grab name that was inputed in the ejs file
    const videoId = req.body.videoID;
    if(
        videoId === undefined ||
        videoId === "" ||
        videoId === null
    ) {
        return res.render("index", {success : false, message: "Please enter a video ID"})
    } else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        //send these back to ejs file, where it is displayed
        if(fetchResponse.status === "ok")
            return res.render("index", {success: true, song_title:fetchResponse.title, song_link : fetchResponse.link});
        else{
            return res.render("index", {success: false, message : fetchResponse.msg});
        }
    }
})

//start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})