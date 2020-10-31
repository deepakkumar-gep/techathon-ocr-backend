const express = require("express")
const mongoose = require("mongoose")
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const routes = require("./routes")

mongoose
	.connect("mongodb+srv://techathon2020:techathon2020@cluster0.qalge.mongodb.net/ocr?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
        const app = express()

        // enable files upload
        app.use(fileUpload({
            createParentPath: true
        }));

        //add other middleware
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(morgan('dev'));

        app.use("/api", routes)

		app.listen(5000, () => {
			console.log("Techathon OCR server has started!")
		})
    })