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

const getLineItems = (lines) => {
    let lineDetails = []
    let rawLineDetails = []
    let lineHeader = []
    let lineStart = false
    // Matches to process Line Details
    const priceMatch = new RegExp("PRICE")
    const qtyMatch1 = new RegExp("QUANTITY")
    const qtyMatch2 = new RegExp("QTY")
    const amountMatch = new RegExp("AMOUNT")
    const invNoMatch = new RegExp("NO")
    const descMatch = new RegExp("DESC")
    // Matches to end Line Details
    const totalMatch = new RegExp("TOTAL")
    const taxMatch = new RegExp("TAX")
    for(line of lines) {
        let isMatch = priceMatch.test(line.toUpperCase()) &&
        ( qtyMatch1.test(line.toUpperCase()) || qtyMatch2.test(line.toUpperCase()) ) &&
        amountMatch.test(line.toUpperCase())

        if(isMatch) {
            lineStart = true
            lineHeader = line.split(' ')
        }

        if(lineStart) {
            if(totalMatch.test(line.toUpperCase()) || taxMatch.test(line.toUpperCase())) {
                lineStart = false
            }
            else {
                rawLineDetails.push(line)
            }
        }
    }

    let noOfHeaders = lineHeader.length
    // If Line Detail is found
    if(rawLineDetails.length > 1) {
        rawLineDetails = rawLineDetails.slice(1)
        rawLineDetails.forEach((line, lineNo) => {
            let descFound = false
            let details = {
                lineNo: "",
                itemNo: "",
                itemDescription: "",
                itemUnitPrice: 0,
                itemQty: 0,
                itemAmount: 0
            }
            lineHeader.forEach((header, i) => {
                details.lineNo = (lineNo + 1) + ""
                if(invNoMatch.test(header.toUpperCase())) {
                    if(descFound) {
                        let values = line.split(" ").reverse()
                        details.itemNo = values[noOfHeaders - i - 1].trim()
                    } else {
                        details.itemNo = line.split(" ")[i].trim()
                    }
                } else if(descMatch.test(header.toUpperCase())) {
                    descFound = true
                    let values = line.split(" ")
                    let valueLength = values.length
                    details.itemDescription = values.slice(i, valueLength - (noOfHeaders - i - 1)).join(" ")
                } else if(priceMatch.test(header.toUpperCase())) {
                    if(descFound) {
                        let values = line.split(" ").reverse()
                        details.itemUnitPrice = getCurrencyValue(values[noOfHeaders - i - 1].trim())
                    } else {
                        details.itemUnitPrice = getCurrencyValue(line.split(" ")[i].trim())
                    }
                } else if(qtyMatch1.test(header.toUpperCase()) || qtyMatch2.test(header.toUpperCase())) {
                    if(descFound) {
                        let values = line.split(" ").reverse()
                        details.itemQty = getCurrencyValue(values[noOfHeaders - i - 1].trim())
                    } else {
                        details.itemQty = getCurrencyValue(line.split(" ")[i].trim())
                    }
                } else if(amountMatch.test(header.toUpperCase())) {
                    if(descFound) {
                        let values = line.split(" ").reverse()
                        details.itemAmount = getCurrencyValue(values[noOfHeaders - i - 1].trim())
                    } else {
                        details.itemAmount = getCurrencyValue(line.split(" ")[i].trim())
                    }
                }
            })
            lineDetails.push(details)
        })
    }
    return lineDetails
}

const performOcr = async (filePath) => {
    let invoiceData = {
        invoiceNo: "",
        invoiceDate: "",
        customerName: "",
        invoiceSubTotal: 0,
        invoiceTax: 0,
        invoiceTotal: 0,
        lineDetail: []
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
        invoiceData.lineDetails = getLineItems(ocrLines)
    })
    return invoiceData
}

module.exports = { performOcr }