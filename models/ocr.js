const mongoose = require("mongoose")

const lineDetailSchema = mongoose.Schema({
    lineNo: String,
    itemNo: String,
    itemDescription: String,
    itemUnitPrice: Number,
    itemQty: Number,
    itemAmount: Number
})

const documentDetailSchema = mongoose.Schema({
    invoiceNo: String,
    invoiceDate: String,
    customerName: String,
    lineDetail: [lineDetailSchema],
    invoiceSubTotal: Number,
    invoiceTax: Number,
    invoiceTotal: Number
})

const ocrSchema = mongoose.Schema({
	fileName: {
        type: String,
        required: true
    },
	fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    uploadedDate: {
        type: Date,
        required: true
    },
    statusId: {
        type: Number,
        required: true
    },
    reasonId: Number,
    invoiceDocumentId: mongoose.Schema.Types.ObjectId,
    documenDetail: documentDetailSchema
})

module.exports = mongoose.model("OCRDocument", ocrSchema)