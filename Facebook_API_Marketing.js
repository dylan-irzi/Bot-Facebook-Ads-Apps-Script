function getFacebookAdCampaigns() {
  // Reemplaza 'ACCESS_TOKEN' con tu Access Token de la Marketing API de Facebook
  var accessToken = '';
  var accountId = 'act_12345678'; // Reemplaza 'act_12345678' con tu ID de cuenta de Facebook Ads

  // Obtiene la hoja de cálculo activa
  var sheet = SpreadsheetApp.getActiveSheet();
  
  try {
    // Hace una solicitud GET a la API de Facebook para obtener los datos de tus campañas
    var response = UrlFetchApp.fetch(`https://graph.facebook.com/v15.0/${accountId}/insights?fields=account_id,campaign_id,campaign_name,clicks,cpc,cpm,spend,reach,impressions&level=campaign&limit=1000&date_preset=this_month&time_increment=all_days&access_token=${accessToken}`);
  } catch (error) {
    // Si ocurre un error, muestra un mensaje de error y detiene la ejecución de la función
    Logger.log(error)
    return;
  }

  // Convierte la respuesta en un objeto JSON
    var insights = JSON.parse(response.getContentText());
    
    // Obtiene el array de campañas
    var campaigns = insights.data;

   // Recorre cada campaña y obtiene sus datos
    for (var i = 0; i < campaigns.length; i++) {
      var campaign = campaigns[i];
      var campaignName = campaign.campaign_name;
      var reach = campaign.reach;
      var totalSpend = campaign.spend;
      var totalImpressions = campaign.impressions;
      var totalClics = campaign.clicks;
      var totalCpc = parseInt(campaign.cpc);
      var totalCpm = parseInt(campaign.cpm);

      // Coloca los datos de cada campaña en la hoja de cálculo
      sheet.getRange(4 + i, 1).setValue(campaignName); // Coloca el nombre de la campaña en la columna A
      sheet.getRange(4 + i, 2).setValue(reach); // Coloca el alcance en la columna B
      sheet.getRange(4 + i, 3).setValue(totalSpend); // Coloca el gasto total en la columna C
      sheet.getRange(4 + i, 4).setValue(totalImpressions); // Coloca el número total de impresiones en la columna D
      sheet.getRange(4 + i, 5).setValue(totalClics); // Coloca el número total de impresiones en la columna E
      sheet.getRange(4 + i, 6).setValue(totalCpc).setNumberFormat("$#,##0"); // Coloca el número total de impresiones en la columna F
      sheet.getRange(4 + i, 7).setValue(totalCpm).setNumberFormat("$#,##0"); // Coloca el número total de impresiones en la columna G
    }
    // Calcula y muestra el total de alcance, el total de gasto y el total de impresiones al final de la hoja de cálculo
    sheet.getRange("B" + (4 + campaigns.length)).setFormula("=SUM(B4:B" + (3 + campaigns.length) + ")"); // Coloca la fórmula para calcular el total de alcance en la última fila de la columna B
    sheet.getRange("C" + (4 + campaigns.length)).setFormula("=SUM(C4:C" + (3 + campaigns.length) + ")"); // Coloca la fórmula para calcular el total de gasto en la última fila de la columna C
    sheet.getRange("D" + (4 + campaigns.length)).setFormula("=SUM(D4:D" + (3 + campaigns.length) + ")"); // Coloca la fórmula para calcular el total de impresiones en la última fila de la columna D
    
}

function insertAdSpendByDay() {
  // Reemplaza 'ACCESS_TOKEN' con tu Access Token de la Marketing API de Facebook
  var accessToken = 'ACCESS_TOKEN';
  var accountId = 'act_12345678'; // Reemplaza 'act_12345678' con tu ID de cuenta de Facebook Ads

  try {
    // Hace una solicitud GET a la API de Facebook para obtener los datos de la inversión publicitaria por día
    var response = UrlFetchApp.fetch(`https://graph.facebook.com/v15.0/${accountId}/insights?fields=spend,date_start&level=account&time_increment=1&limit=1000&date_preset=this_month&access_token=${accessToken}`);
  } catch (error) {
    // Si hay un error, muestra un mensaje en la consola del editor
    console.log(error);
  }
 
  var sheet = SpreadsheetApp.getActiveSheet();

  // Obtiene la fila de inicio de la tabla de datos
  var row = 12;

  // Convierte la respuesta en un objeto JSON
  var insights = JSON.parse(response.getContentText());

  // Obtiene el array de datos
  var data = insights.data;

  // Recorre cada elemento del array de datos
  for (var i = 0; i < data.length; i++) {
    // Obtiene la fecha y la inversión publicitaria del día actual
    var date = data[i].date_start;
    var spend = data[i].spend;

    // Establece el valor de la celda en la nueva fila
    sheet.getRange(row + i, 1).setValue(date);
    sheet.getRange(row + i, 2).setValue(spend).setNumberFormat("$#,##0");
  }
}

function botSendText() {

  // Reemplaza 'ACCESS_TOKEN' con tu Access Token de la Marketing API de Facebook
  var accessToken = 'ACCESS_TOKEN';
  var accountId = 'act_12345678'; // Reemplaza 'act_12345678' con tu ID de cuenta de Facebook Ads

  try {
    // Hace una solicitud GET a la API de Facebook para obtener los datos de la inversión publicitaria por día
    var response = UrlFetchApp.fetch(`https://graph.facebook.com/v15.0/${accountId}/insights?fields=spend,date_start&level=account&time_increment=1&limit=10&date_preset=yesterday&access_token=${accessToken}`);
  } catch (error) {
    // Si hay un error, muestra un mensaje en la consola del editor
    console.log(error);
  }

   // Convierte la respuesta en un objeto JSON
  var insights = JSON.parse(response.getContentText());

  // Obtiene el array de datos
  var data = insights.data;


  for (var i = 0; i < data.length; i++) {
    // Obtiene la fecha y la inversión publicitaria del día actual
    var date = data[i].date_start;
    var spend = data[i].spend;
  }

  spend = spend.toLocaleString();

  var botMessage = "Hola, el consumo del dia "+date+" de la cuenta publicitaria de Azzurry fue de: $"+spend;


  var botToken = 'ChatBot_Token_Telegram';
  var botChatID = 'Chat Id_Telegram';
  var sendText = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + botChatID + '&parse_mode=Markdown&text=' + botMessage;

  var response = UrlFetchApp.fetch(sendText);

  return response.getContentText();
}


