const mongoose = require("mongoose")

const lineDetailSchema = mongoose.Schema({
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
    invoiceNo: String,
    invoiceDate: Date,
    customerName: String,
    lineDetail: [lineDetailSchema],
    invoiceSubTotal: Number,
    invoiceTax: Number,
    invoiceTotal: Number
})

module.exports = mongoose.model("InvoiceDocument", invoiceSchema)