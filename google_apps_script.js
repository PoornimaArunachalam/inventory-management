/**
 * GOOGLE APPS SCRIPT FOR INVENTORY MANAGEMENT SYSTEM
 * 
 * 1. Open a Google Sheet.
 * 2. Create two tabs: "Products" and "Sales".
 * 3. Extensions > Apps Script.
 * 4. Paste this code and Deploy > New Deployment > Web App.
 * 5. Set "Execute as: Me" and "Who has access: Anyone".
 */

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const PRODUCT_SHEET = "Products";
const SALES_SHEET = "Sales";

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productsSheet = ss.getSheetByName(PRODUCT_SHEET);
  const productsData = productsSheet.getDataRange().getValues();
  const headers = productsData.shift();

  const products = productsData.map(row => {
    const obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });

  const salesSheet = ss.getSheetByName(SALES_SHEET);
  const salesData = salesSheet.getDataRange().getValues();
  const salesHeaders = salesData.shift();
  const sales = salesData.map(row => {
    const obj = {};
    salesHeaders.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify({ products, sales }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productsSheet = ss.getSheetByName(PRODUCT_SHEET);
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  try {
    if (action === "ADD_PRODUCT") {
      const headers = productsSheet.getRange(1, 1, 1, productsSheet.getLastColumn()).getValues()[0];
      const newRow = headers.map(h => data.payload[h] || "");
      productsSheet.appendRow(newRow);
      return success({ message: "Product added" });
    }

    if (action === "UPDATE_PRODUCT") {
      const id = data.payload.id;
      const rows = productsSheet.getDataRange().getValues();
      const headers = rows.shift();
      const rowIndex = rows.findIndex(row => row[0].toString() === id.toString());

      if (rowIndex !== -1) {
        const range = productsSheet.getRange(rowIndex + 2, 1, 1, headers.length);
        const updatedRow = headers.map(h => data.payload[h] !== undefined ? data.payload[h] : rows[rowIndex][headers.indexOf(h)]);
        range.setValues([updatedRow]);
        return success({ message: "Product updated" });
      }
    }

    if (action === "DELETE_PRODUCT") {
      const id = data.payload.id;
      const rows = productsSheet.getDataRange().getValues();
      const rowIndex = rows.findIndex(row => row[0].toString() === id.toString());
      if (rowIndex !== -1) {
        productsSheet.deleteRow(rowIndex + 1); // +1 because we skipped headers in findIndex but rows is 0-indexed from dataRange
        return success({ message: "Product deleted" });
      }
    }

    if (action === "RECORD_SALE") {
      const salesSheet = ss.getSheetByName(SALES_SHEET);
      salesSheet.appendRow([
        data.payload.id, 
        data.payload.productId, 
        data.payload.productName, 
        data.payload.category, 
        data.payload.quantity, 
        data.payload.unitPrice, 
        data.payload.amount, 
        data.payload.date
      ]);
      return success({ message: "Sale recorded" });
    }

    return error("Invalid action");
  } catch (err) {
    return error(err.toString());
  }
}

function success(payload) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: payload }))
    .setMimeType(ContentService.MimeType.JSON);
}

function error(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
