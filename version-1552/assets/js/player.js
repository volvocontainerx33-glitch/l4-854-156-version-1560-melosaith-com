document.addEventListener("DOMContentLoaded", function () {
  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function (shell) {
    var video = shell.querySelector("video[data-hls-src]");
    var button = shell.querySelector("[data-play-button]");

    if (!video) {
      return;
    }

    var source = video.getAttribute("data-hls-src");

    if (source && window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        hls.destroy();
      });
    } else if (source && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (source) {
      video.src = source;
    }

    if (button) {
      button.addEventListener("click", function () {
        video.play();
      });
    }

    video.addEventListener("play", function () {
      shell.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      shell.classList.remove("is-playing");
    });
  });
});
