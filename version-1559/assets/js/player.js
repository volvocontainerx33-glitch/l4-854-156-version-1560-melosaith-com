(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var button = player.querySelector('.player-start');
    var stream = video ? video.getAttribute('data-play') : '';
    var prepared = false;
    var hls = null;

    function startPlayback() {
      if (!video || !stream) {
        return;
      }

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      video.controls = true;

      if (!prepared) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          prepared = true;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          prepared = true;
        } else {
          video.src = stream;
          prepared = true;
        }
      }

      video.play().catch(function () {});
    }

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        startPlayback();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        } else {
          video.pause();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  });
})();
