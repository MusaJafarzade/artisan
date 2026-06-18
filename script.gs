// НАСТРОЙКИ
var SPREADSHEET_ID = "1Wv3gRccMFAGmOr2nB7P6Od5W2wDkjXRD8PScxOT74M0";
var TG_TOKEN = "8820904159:AAHaaPfqYcqL9DqB4n9WH-qrU2-8d_gzExc";
var CHAT_ID = "8694190255"; // Обязательно впиши сюда свой ID из @userinfobot

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Artisan & Co')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function processOrder(orderData) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
  
  // Отправляем уведомление в Telegram
  sendTelegramNotification(orderId, orderData);
  
  return "SUCCESS";
}

function sendTelegramNotification(orderId, orderData) {
  try {
    var message = "🔔 *Новый заказ в Artisan & Co!* \n\n" +
                  "🆔 ID: " + orderId + "\n" +
                  "👤 Имя: " + orderData.name + "\n" +
                  "📞 Телефон: " + orderData.phone + "\n" +
                  "🛒 Заказ: " + orderData.cartItems + "\n" +
                  "💰 Сумма: " + orderData.total;
    
    var url = "https://api.telegram.org/bot" + TG_TOKEN + "/sendMessage?chat_id=" + CHAT_ID + 
              "&text=" + encodeURIComponent(message) + "&parse_mode=Markdown";
    
    UrlFetchApp.fetch(url);
  } catch (e) {
    Logger.log("Ошибка отправки в ТГ: " + e.toString());
  }
}
