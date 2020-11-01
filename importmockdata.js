const { MongoClient } = require("mongodb");
var fs = require('fs');
var fsextra = require('fs-extra')
const config = require('./config');
const { mongo } = require("mongoose");

const connectionString = config.mockdata.connectionString;
const dbName = config.mockdata.dbName;
const collectionOcrName = config.mockdata.collectionOcrName;
const collectionInvoiceName = config.mockdata.collectionInvoiceName;
const mockdataJsonFilePathOcr = config.mockdata.mockdataJsonFilePathOcr;
const mockdataJsonFilepathInvoice = config.mockdata.mockdataJsonFilepathInvoice;
const mockdataDocumentFilePath = config.mockdata.mockdataDocumentFilePath;
const mockdataUploadDocumentFilePath = config.mockdata.mockdataUploadDocumentFilePath;

const uri = connectionString;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const sampleocrObjId = [];
    const sampleinvoiceObjId = [];

    const database = client.db(dbName);
    const collectionOcr = database.collection(collectionOcrName);
    
    const collectionInvoice = database.collection(collectionInvoiceName);
    var sampleocr = JSON.parse(fs.readFileSync(mockdataJsonFilePathOcr, 'utf8'));
    var sampleinvoice = JSON.parse(fs.readFileSync(mockdataJsonFilepathInvoice, 'utf8'));

    //Delete existing documents
    const queryDeleteOcr = { fileName : /^/ };
    const queryDeleteInvoice = { customerName: /^/ };
    const resultDeleteOcr = await collectionOcr.deleteMany(queryDeleteOcr);
    const resultDeleteInvoice = await collectionInvoice.deleteMany(queryDeleteInvoice);
    console.log("Deleted " + resultDeleteOcr.deletedCount + " documents");
    console.log("Deleted " + resultDeleteInvoice.deletedCount + " documents");

    const len = sampleocr.length;
    for (i = 0; i < len; i++) {

      //Insert into sampleocr Collection
      const resultOcr = await collectionOcr.insertOne(sampleocr[i]);
      console.log(
        `${resultOcr.insertedCount} sampleocr _id: ${resultOcr.insertedId}`,
      );
      
      //Insert into sampleinvoice Collection
      const resultInvoice = await collectionInvoice.insertOne(sampleinvoice[i]);
      console.log(
        `${resultInvoice.insertedCount} sampleinvoice _id: ${resultInvoice.insertedId}`,
      );
      sampleinvoiceObjId.push(resultInvoice.insertedId);
      sampleocrObjId.push(resultOcr.insertedId);
      const fileName = sampleocr[i]['fileName']
      fsextra.copy(mockdataDocumentFilePath+fileName, mockdataUploadDocumentFilePath+fileName, function (err) {
        if (err) return console.error(err)
        console.log("success!")
      })
    }

    //Update Object ID in both Collection
    for (i = 0; i < len; i++) {
      console.log(`${sampleocrObjId[i]} ${sampleinvoiceObjId[i]}`);
      const filterOcr = { _id: new mongo.ObjectID(sampleocrObjId[i]) };
      const filterInvoice = { _id: new mongo.ObjectID(sampleinvoiceObjId[i]) };
      const options = { upsert: true };
      const updateDocOcr = {
        $set: {
          invoiceDocumentId: sampleinvoiceObjId[i],
        },
      };
      const updateDocInvoice = {
        $set: {
          ocrDocumentId: sampleocrObjId[i],
        },
      };
      const resultUpdateOcr = await collectionOcr.updateOne(filterOcr, updateDocOcr, options);
      const resultUpdateInvoice = await collectionInvoice.updateOne(filterInvoice, updateDocInvoice, options);
      console.log(
        `${resultUpdateOcr.matchedCount} document(s) matched the filter, updated ${resultUpdateOcr.modifiedCount} document(s)`,
      );
      console.log(
        `${resultUpdateInvoice.matchedCount} document(s) matched the filter, updated ${resultUpdateInvoice.modifiedCount} document(s)`,
      );
    }
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);



