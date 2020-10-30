const express = require("express")
const mongoose = require("mongoose")

mongoose
	.connect("mongodb+srv://techathon2020:techathon2020@cluster0.qalge.mongodb.net/ocr?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		const app = express()

		app.listen(5000, () => {
			console.log("Techathon OCR server has started!")
		})
	})