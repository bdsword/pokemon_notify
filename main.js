window.addEventListener ("load", function() {
  function notify(msg) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
      var notification = new Notification(msg);
    }

    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          var notification = new Notification(msg);
        }
      });
    }
  }

  setInterval(function() {
    $('img.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive').each(function(e){
        $this = $(this);
        src = $this.attr('src');
        if (src.match(/\/images\/.*\/.*147.*\.png/g) != null){
        	notify('找到高IV迷你龍')
        } else if (src.match(/\/images\/.*\/.*148.*\.png/g) != null) {
          notify('找到高IV哈克龍')
        } else if (src.match(/\/images\/.*\/.*149.*\.png/g) != null) {
          notify('找到快龍了！')
        }
        var notificationAudio = new Audio();        // create the audio object
        notificationAudio.src = "./notification.mp3"; // assign the audio file to it
        notificationAudio.play();
    });
    $('#updatespan').click();
  }, 5000);
}, false);
