window.addEventListener ("load", function() {
  function notify(msg) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
      var notification = new Notification(msg);
      notificationAudio.play();
    }

    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          var notification = new Notification(msg);
          notificationAudio.play();
        }
      });
    }
  }

  var notificationAudio = new Audio();
  notificationAudio.src = "https://raw.githubusercontent.com/bdsword/pokemon_notify/master/notification.mp3";

  setInterval(function() {
    $('img.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive').each(function(e){
        $this = $(this);
        src = $this.attr('src');
        if (src.match(/\/images\/.*\/.*147_.*\.png/g) != null){
        	notify('發現高IV迷你龍')
        } else if (src.match(/\/images\/.*\/.*148_.*\.png/g) != null) {
          notify('發現高IV哈克龍')
        } else if (src.match(/\/images\/.*\/.*149.*\.png/g) != null) {
          notify('發現快龍！!')
        }
    });
    $('#updatespan').click();
  }, 60000);
}, false);
