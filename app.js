//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// to setup Connection to mongoDB 
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });
// To Create article Schema
const articleSchema = {
    title: { type: String },
    content: { type: String }
}

// To create mongoose Model(model name here Article)
const Article = mongoose.model("Article", articleSchema);

// Chained Route handlers using express 
// app.route("/articles").get().post().delete();
///////////////////////////////////////////////Request Targetting all Articles////////////////////////////////////
app.route("/articles")
    .get((req, res) => {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new Article");
            } else {
                res.send("err");
            }
        });
    });

///////////////////////////////////////////////Request Targetting A Specific Articles////////////////////////////////////
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No Articles Matching")
            }
        })
    })
    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully Updated Article.")
                } else {
                    res.send("err");
                }
            }
        );
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (err) {
                    res.send("Successfully Updated Article.")
                } else {
                    res.send("err");
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("Successfully Deleted")
                } else {
                    res.send("err");
                }
            }
        );
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});