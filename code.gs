// НАСТРОЙКИ
var SPREADSHEET_ID = "1Wv3gRccMFAGmOr2nB7P6Od5W2wDkjXRD8PScxOT74M0";
var TG_TOKEN = "8820904159:AAHaaPfqYcqL9DqB4n9WH-qrU2-8d_gzExc";
var CHAT_ID = "8694190255";
function doPost(e) {
  // 1. Создаем ответ
  var output = ContentService.createTextOutput(JSON.stringify({"status": "success"}));
  output.setMimeType(ContentService.MimeType.JSON);

  // 2. Добавляем "разрешения" для любого сайта
  output.addHeader("Access-Control-Allow-Origin", "*");
  output.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  output.addHeader("Access-Control-Allow-Headers", "Content-Type");

  return output;
}

function doOptions(e) {
  var output = ContentService.createTextOutput("");
  output.addHeader("Access-Control-Allow-Origin", "*");
  output.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  output.addHeader("Access-Control-Allow-Headers", "Content-Type");
  return output;
}
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Artisan & Co')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function processOrder(orderData) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    // Берем первый лист в таблице, чтобы не было ошибок с именами
    var sheet = ss.getSheets()[0]; 
    
    // Добавляем заголовки, если лист пуст
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Order ID", "Date & Time", "Customer Name", "Phone Number", "Telegram Username", "Cart Details", "Total Amount", "Order Status"]);
    }
    
    var orderId = "ORD-" + new Date().getTime().toString().slice(-6);
    
    // Пишем в таблицу
    sheet.appendRow([
      orderId, 
      new Date(), 
      orderData.name, 
      orderData.phone, 
      "", 
      orderData.cartItems, 
      orderData.total, 
      "New"
    ]);
    
    // Отправляем уведомление
    sendTelegramNotification(orderId, orderData);
    
    return "SUCCESS";
  } catch (e) {
    return "ERROR: " + e.toString();
  }
}

function sendTelegramNotification(orderId, orderData) {
  var message = "🔔 *Тестовый заказ:* " + orderId;
  var url = "https://api.telegram.org/bot" + TG_TOKEN + "/sendMessage?chat_id=" + CHAT_ID + 
            "&text=" + encodeURIComponent(message) + "&parse_mode=Markdown";
  
  var response = UrlFetchApp.fetch(url);
  Logger.log("Ответ от ТГ: " + response.getContentText());
}
