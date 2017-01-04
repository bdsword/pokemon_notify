var notifications = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  notification_name = request.options['notification_name'];
  delete request.options['notification_name'];
  if (request.type == "notification"){
    chrome.notifications.create(notification_name, request.options, function(){});

    var result = $.grep(notifications, function(e){ return e.id == notification_name; });
    if (result.length == 0) {
      notifications.push({id: notification_name, responser: sendResponse});
    }

    return true;
  }
});

chrome.notifications.onButtonClicked.addListener(function callback(id){
  if (id.indexOf("Pokemon Notifications") > -1) {
    var result = $.grep(notifications, function(e){ return e.id == id; });
    if (result.length == 1) {
      var regex = /Pokemon Notifications (.*)/g;
      uid = regex.exec(id)[1];
      result[0].responser({id: uid});
    }
  }
});
