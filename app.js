const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("express");
const { post } = require("request");

const mailChimpAPI = "a8bd918107f438be743ec4b86cafe578-us8"
const mailChimpListID = "69cc07edb4"

const app = express()
app.use(bodyParser.urlencoded({ extende: true }))
app.use(express.static("public"))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    let fName = req.body.fName
    let lName = req.body.lName
    let email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data)
    const url = "https:us8.api.mailchimp.com/3.0/lists/" + mailChimpListID

    options = {
        method: "POST",
        auth: "sudeepsw:" + mailChimpAPI
    }

    const request = https.request(url, options, function (response) {
        console.log("Status code: " + response.statusCode);

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData)
    request.end()
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is up and running on port 3000.");
})
