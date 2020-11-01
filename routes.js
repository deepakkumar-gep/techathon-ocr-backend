const express = require("express")
const router = express.Router()

const OCRDocument = require("./models/ocr")
const InvoiceDocument = require("./models/invoice")

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

// Update OCR document status
router.post("/ocr/update-status", async (req, res) => {
    try {
        const ocrDoc = await InvoiceDocument.OCRDocument(
            { _id: req.body.ocrDocumentId },
            { statusId: req.body.statusId }
            )
        res.send(ocrDoc)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Save OCR documents to static folder and mongoDB
const saveDocument = (document, uploadedBy) => {
    document.mv('./uploads/' + document.name)
    const ocrDoc = new OCRDocument({
		fileName: document.name,
        fileUrl: "/" + document.name,
        uploadedBy: uploadedBy,
        uploadedDate: Date.now(),
        statusId: 1
    })
    ocrDoc.save()
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
                    data.push(saveDocument(document, req.body.uploadedBy))
                })
            } else {
                let document = req.files.documents
                data.push(saveDocument(document, req.body.uploadedBy))
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

// Get Invoice documents based on id
router.get("/invoice/:id", async (req, res) => {
    try {
        let filter = {_id: req.params.id}
        const invoice = await InvoiceDocument.find(filter)
        res.send(invoice)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get Invoice documents based on invoiceNo
router.get("/invoice/search/:invoiceNo", async (req, res) => {
    try {
        let filter = {invoiceNo: req.params.invoiceNo}
        const invoice = await InvoiceDocument.find(filter)
        res.send(invoice)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Save new Invoice document
router.post("/invoice/add", async (req, res) => {
    try {
        const invoiceDoc = new InvoiceDocument({
            ocrDocumentId: req.body.ocrDocumentId,
            invoiceNo: req.body.invoiceNo,
            invoiceDate: req.body.invoiceDate,
            customerName: req.body.customerName,
            lineDetail: req.body.lineDetail,
            invoiceSubTotal: req.body.invoiceSubTotal,
            invoiceTax: req.body.invoiceTax,
            invoiceTotal: req.body.invoiceTotal
        })
        const invoice = await invoiceDoc.save()
        res.send(invoice)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update existing Invoice document
router.post("/invoice/edit", async (req, res) => {
    try {
        const invoice = await InvoiceDocument.update(
            { _id: req.body._id, },
            {
                invoiceNo: req.body.invoiceNo,
                invoiceDate: req.body.invoiceDate,
                customerName: req.body.customerName,
                lineDetail: req.body.lineDetail,
                invoiceSubTotal: req.body.invoiceSubTotal,
                invoiceTax: req.body.invoiceTax,
                invoiceTotal: req.body.invoiceTotal
            })
        res.send(invoice)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router