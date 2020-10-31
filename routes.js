const express = require("express")
const router = express.Router()

const OCRDocument = require("./models/ocr")

// Get all OCR documents
router.get("/ocr", async (req, res) => {
    try {
        const documents = await OCRDocument.find()
        res.send(documents)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get OCR documents based on statusId
router.get("/ocr/:statusId", async (req, res) => {
    try {
        let filter = {statusId: req.params.statusId}
        const documents = await OCRDocument.find(filter)
        res.send(documents)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Save OCR documents to static folder and mongoDB
const saveDocument = document => {
    document.mv('./uploads/' + document.name)
    const ocrDocument = new OCRDocument({
		fileName: document.name,
        fileUrl: "/" + document.name,
        uploadedBy: "5f9c4151c6f8e54c3bfd51a6",
        uploadedDate: Date.now(),
        statusId: 1
    })
    ocrDocument.save()
    return ({
        name: document.name,
        size: document.size
    })
}

// Upload documents or images for OCR
router.post('/upload-documents', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        } else {
            let data = []

            if(Array.isArray(req.files.documents)){
                req.files.documents.forEach((document) => {
                    data.push(saveDocument(document))
                })
            } else {
                let document = req.files.documents
                data.push(saveDocument(document))
            }
            
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router