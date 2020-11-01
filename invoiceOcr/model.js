const Tesseract = require('tesseract.js')
const pdf2pic = require('pdf2pic')

const getCurrencyValue = currencyString => {
    const value = Number(currencyString.replace(/[^0-9.-]+/g,""))
    return isNaN(value) ? 0 : value
}

const convertPdfToImg = (filePath) => {
    const options = {
        density: 100,
        saveFilename: "untitled",
        savePath: "./images",
        format: "png",
        width: 600,
        height: 600
    }

    const storeAsImage = pdf2pic.fromPath(filePath, options)
    const pageToConvertAsImage = 1
    
    storeAsImage(pageToConvertAsImage).then((resolve) => {
        console.log("Page 1 is now converted as image")
        process.exit(0)
    }).catch((error) => console.log(error))
}

const performOcr = async (filePath) => {
    let invoiceData = {
        invoiceNo: "",
        invoiceDate: "",
        customerName: "",
        invoiceSubTotal: 0,
        invoiceTax: 0,
        invoiceTotal: 0
    }
    await Tesseract.recognize(filePath)
    .catch((error) => console.log(error))
    .then((result) => {
        let ocrLines = result.data.text.split("\n")
        for(line of ocrLines) {
            if(new RegExp("INVOICE #").test(line)) {
                let match =  line.match(/INVOICE # ([^<]+)/i)
                invoiceData.invoiceNo = match[1].trim()
            }
            if(new RegExp("INVOICE DATE").test(line)) {
                let match =  line.match(/INVOICE DATE ([^<]+)/i)
                invoiceData.invoiceDate = match[1].trim()
            }
            if(new RegExp("BILLTO").test(line.toUpperCase())) {
                let match =  line.toUpperCase().match(/BILLTO ([^<]+)/i)
                invoiceData.customerName = match[1].trim().split(",")[0]
            }
            if(new RegExp("BILL TO").test(line.toUpperCase())) {
                let match =  line.toUpperCase().match(/BILL TO ([^<]+)/i)
                invoiceData.customerName = match[1].trim().split(",")[0]
            }
            if(new RegExp("SUBTOTAL").test(line.toUpperCase())) {
                let match =  line.toUpperCase().match(/SUBTOTAL ([^<]+)/i)
                invoiceData.invoiceSubTotal = getCurrencyValue(match[1].trim())
            }
            if(new RegExp("TAX").test(line.toUpperCase())) {
                let match =  line.toUpperCase().match(/TAX ([^<]+)/i)
                invoiceData.invoiceTax = getCurrencyValue(match[1].trim())
            }
            if(new RegExp("TOTAL").test(line.toUpperCase())) {
                let match =  line.toUpperCase().match(/TOTAL ([^<]+)/i)
                invoiceData.invoiceTotal = getCurrencyValue(match[1].trim())
            }
        }
    })
    return invoiceData
}

module.exports = { performOcr }