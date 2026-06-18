(function () {
  window.initMoviePlayer = function (sourceUrl) {
    const video = document.querySelector(".movie-player-video");
    const button = document.querySelector(".js-play-button");
    const overlay = document.querySelector(".player-overlay");
    let hasLoaded = false;
    let hlsInstance = null;

    function loadVideo() {
      if (!video || !sourceUrl) {
        return;
      }

      if (!hasLoaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(sourceUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = sourceUrl;
        }
        hasLoaded = true;
      }

      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.controls = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", loadVideo);
    }

    if (overlay) {
      overlay.addEventListener("click", loadVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!hasLoaded) {
          loadVideo();
        }
      });
    }

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
