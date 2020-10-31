const mongoose = require("mongoose")

const invoiceLineDetailSchema = mongoose.Schema({
    lineNo: String,
    itemNo: String,
    itemDescription: String,
    itemUnitPrice: Number,
    itemQty: Number,
    itemAmount: Number
})

const invoiceSchema = mongoose.Schema({
    ocrDocumentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
	fileUrl: {
        type: String,
        required: true
    },
    invoiceNo: String,
    invoiceDate: String,
    customerName: String,
    lineDetail: [invoiceLineDetailSchema],
    invoiceSubTotal: Number,
    invoiceTax: Number,
    invoiceTotal: Number
})

module.exports = mongoose.model("InvoiceDocument", invoiceSchema)