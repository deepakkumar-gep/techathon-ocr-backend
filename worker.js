const model = require('./invoiceOcr/model')

const OCRDocument = require('./models/ocr')
const InvoiceDocument = require("./models/invoice")

const execModel = async () => {
    try {
        let filter = {statusId: 1}
        const documents = await OCRDocument.find(filter)
        
        if(documents.length === 0) {
            console.log('No Document found in Draft status')
        } else {
            console.log(documents.length + ' Document found in Draft status')
            let draftDocument = documents[0]
            let docId = draftDocument._id
            let fileUrl = draftDocument.fileUrl
    
            // Update status to In Progress
            await OCRDocument.updateOne({ _id: docId }, { statusId: 2 })
    
            let filePath = './uploads' + fileUrl
            model.performOcr(filePath).then((documentDetail) => {
                const invoiceDoc = new InvoiceDocument({
                    ocrDocumentId: docId,
                    fileUrl: fileUrl,
                    invoiceNo: documentDetail.invoiceNo,
                    invoiceDate: documentDetail.invoiceDate,
                    customerName: documentDetail.customerName,
                    lineDetail: documentDetail.lineDetail,
                    invoiceSubTotal: documentDetail.invoiceSubTotal,
                    invoiceTax: documentDetail.invoiceTax,
                    invoiceTotal: documentDetail.invoiceTotal
                })
                invoiceDoc.save().then((invoiceDocument) => {
                    OCRDocument.updateOne({ _id: docId },
                        {
                            invoiceDocumentId: invoiceDocument._id,
                            documentDetail: {
                                invoiceNo: documentDetail.invoiceNo,
                                invoiceDate: documentDetail.invoiceDate,
                                customerName: documentDetail.customerName,
                                lineDetail: documentDetail.lineDetail,
                                invoiceSubTotal: documentDetail.invoiceSubTotal,
                                invoiceTax: documentDetail.invoiceTax,
                                invoiceTotal: documentDetail.invoiceTotal
                            },
                            statusId: 4
                        }).then(() => {
                            console.log("OCR performed on record: " + docId)
                        }).catch((error) => console.log(error))
                }).catch((error) => console.log(error))
            }).catch((error) => console.log(error))
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { execModel }