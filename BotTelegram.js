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

  var botMessage = "Hola, el consumo del dia "+date+" de la cuenta publicitaria fue de: $"+spend;


  var botToken = ''; //aqui debes ingresar el BotToken que te genero BotFather
  var botChatID = ''; //aqui debes ingresar el identificador del chat
  var sendText = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + botChatID + '&parse_mode=Markdown&text=' + botMessage;

  var response = UrlFetchApp.fetch(sendText);

  return response.getContentText();
}
