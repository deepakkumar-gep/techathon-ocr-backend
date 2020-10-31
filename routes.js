const express = require("express")
const router = express.Router()

const ocr = require("./models/ocr")

// Get all OCR documents
router.get("/ocr", async (req, res) => {
	const documents = await ocr.find()
	res.send(documents)
})

module.exports = router