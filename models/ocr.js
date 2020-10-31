const mongoose = require("mongoose")

const lineDetailSchema = mongoose.Schema({
    lineNo: String,
    itemDescription: String,
    itemUnitPrice: String,
    itemQty: String,
    itemAmount: String
})

const documentDetailSchema = mongoose.Schema({
    invoiceNo: String,
    invoiceDate: String,
    customerName: String,
    lineDetail: [lineDetailSchema]
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

module.exports = mongoose.model("OCRCollection", ocrSchema)