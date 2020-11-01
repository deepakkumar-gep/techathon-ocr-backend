const config = {
    app: {
        port: 5000
    },
    db: {
        // connectionString: 'mongodb+srv://techathon2020:techathon2020@cluster0.qalge.mongodb.net/OCR?retryWrites=true&w=majority'
        connectionString: 'mongodb+srv://techathon-admin:TechathonDemo@cluster0.c29nl.mongodb.net/OCR?retryWrites=true&w=majority'
    },
    mockdata: {
        // connectionString: 'mongodb+srv://techathon2020:techathon2020@cluster0.qalge.mongodb.net/OCR?retryWrites=true&w=majority',
        connectionString: 'mongodb+srv://techathon-admin:TechathonDemo@cluster0.c29nl.mongodb.net/OCR?retryWrites=true&w=majority',
        dbName: "OCR",
        collectionOcrName: 'ocrdocuments',
        collectionInvoiceName: 'invoicedocuments',
        mockdataJsonFilePathOcr: 'mockdata/sampleocr.json',
        mockdataJsonFilepathInvoice: 'mockdata/sampleinvoice.json',
        mockdataDocumentFilePath: 'mockdata/documents/',
        mockdataUploadDocumentFilePath: 'uploads/documents/'
    }
};

module.exports = config;