window.addEventListener ("load", function() {

  var ignored_uid = [];

  function sha1(str) {
    var rotate_left = function(n, s) {
      var t4 = (n << s) | (n >>> (32 - s));
      return t4;
    };

    var cvt_hex = function(val) {
      var str = '';
      var i;
      var v;

      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    var str_len = str.length;

    var word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
      j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
      word_array.push(j);
    }

    switch (str_len % 4) {
      case 0:
        i = 0x080000000;
        break;
      case 1:
        i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
        break;
      case 2:
        i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
        break;
      case 3:
        i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
          8 | 0x80;
        break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) {
      word_array.push(0);
    }

    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
      for (i = 0; i < 16; i++) {
        W[i] = word_array[blockstart + i];
      }
      for (i = 16; i <= 79; i++) {
        W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      }

      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;

      for (i = 0; i <= 19; i++) {
        temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 20; i <= 39; i++) {
        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 40; i <= 59; i++) {
        temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 60; i <= 79; i++) {
        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;
    }

    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
  }

  function notify(uid, msg, img_url) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
      if (ignored_uid.indexOf(uid) == -1){
        // var notification = new Notification(msg);
        chrome.runtime.sendMessage({type: "notification", options: {
          type: 'basic',
          iconUrl: img_url,
          notification_name: 'Pokemon Notifications ' + uid,
          title: '寶可夢通知',
          message: msg,
          buttons: [
            { title: 'Ignore' },
          ]
        }}, function(response) {
          ignored_uid.push(response['id']);
        });

        notificationAudio.play();
      }
    }
    else if (Notification.permission !== 'denied') {
      // No used
    }
  }

  var notificationAudio = new Audio();
  notificationAudio.src = "https://raw.githubusercontent.com/bdsword/pokemon_notify/master/notification.mp3";

  setInterval(function() {
    $('img.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive').each(function(e){
        $this = $(this);
        src = $this.attr('src');
        style = $this.attr('style');
        if (src.match(/\/images.*147.*\.png/g) != null){
        	notify(sha1(style), '發現高IV迷你龍', 'https://pkget.com' + src)
        } else if (src.match(/\/images.*148.*\.png/g) != null) {
          notify(sha1(style), '發現高IV哈克龍', 'https://pkget.com' + src)
        } else if (src.match(/\/images.*149.*\.png/g) != null) {
          notify(sha1(style), '發現快龍！!', 'https://pkget.com' + src)
        }
    });
    $('#updatespan').click();
  }, 6000);
}, false);
