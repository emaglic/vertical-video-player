import "./index.scss";

export default class VerticalVideo {
  // --------------------------------------------------------------------------------
  constructor({ container, src, segments }) {
    this.src = src;
    this.segments = segments - 1;
    this.elements = { container };
    this.isPlaying = false;
    this.currentSegment = 0;
    this.skipAmt = 1;
    this.notificationTimer = null;
    this.notificationDelay = 1.25;
    this.showControls = true;
    this.initUI(this.elements);
    this.initVideo();
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  initUI({ container }) {
    const main = document.createElement("div");
    main.classList.add("vv-main");
    main.innerHTML = /*html*/ `
      <div class='vv-video-container'>
        <video class='vv-video'>
      </div>
      <div class='vv-controls'>
        <div class='vv-control-toggle'>
          <button class='vv-hide-controls-btn vv-icon vv-btn' style='background-image: url("media/images/chevron-left.svg")'></button>
        </div>
        <div class='vv-click-catcher'></div>
        <div class='vv-notification-container hidden'>
          <p class='vv-notification'></p>
        </div>
        <div class='vv-controls-inner'>
          <div class='vv-video-controls'>
            <div class='vv-video-control-top hidden'>
              <button>Test Button</button>
              <button>Test Button</button>
              <button>Test Button</button>
            </div>
            <input class='vv-video-progress-bar' type='range' step='0.1' value='0' min='0' max='100'>
            <div class='vv-video-controls-bottom'>
              <button class='vv-skip-back vv-icon flip-x vv-btn' style='background-image: url("media/images/fast-forward.svg")'></button>
              <button class='vv-play-pause vv-icon play-icon vv-btn' style='background-image: url("media/images/play.svg")'></button>
              <button class='vv-stop vv-icon vv-btn' style='background-image: url("media/images/stop.svg")'></button>
              <button class='vv-restart vv-icon vv-btn' style='background-image: url("media/images/restart.svg")'></button>
              <button class='vv-sound-toggle vv-icon vv-btn' style='background-image: url("media/images/volume-on.svg")'></button>
              <button class='vv-skip-fwd vv-icon vv-btn' style='background-image: url("media/images/fast-forward.svg")'></button>
            </div>
          </div>
          <div class='vv-segment-controls'>
            <button class="vv-prev vv-icon flip-y" style='background-image: url("media/images/arrow.svg")'></button>
            <button class='vv-next vv-icon' style='background-image: url("media/images/arrow.svg")'></button>
          </div>
        </div>
      </div>
    `;

    const video = main.querySelector(".vv-video");
    const videoContainer = main.querySelector(".vv-video-container");
    const controlsContainer = main.querySelector(".vv-controls");
    const videoControls = controlsContainer.querySelector(".vv-video-controls");
    const segmentControls = controlsContainer.querySelector(".vv-segment-controls");
    const controls = {
      container: controlsContainer,
      controlsInner: controlsContainer.querySelector(".vv-controls-inner"),
      controlsToggle: controlsContainer.querySelector(".vv-control-toggle"),
      hideControlsBtn: controlsContainer.querySelector(".vv-hide-controls-btn"),
      notifications: {
        container: controlsContainer.querySelector(".vv-notification-container"),
        notification: controlsContainer.querySelector(".vv-notification"),
      },
      segment: {
        container: segmentControls,
        prev: controlsContainer.querySelector(".vv-prev"),
        next: controlsContainer.querySelector(".vv-next"),
      },
      video: {
        container: videoControls,
        clickCatcher: controlsContainer.querySelector(".vv-click-catcher"),
        progress: videoControls.querySelector(".vv-video-progress-bar"),
        playPause: videoControls.querySelector(".vv-play-pause"),
        stop: videoControls.querySelector(".vv-stop"),
        soundToggle: videoControls.querySelector(".vv-sound-toggle"),
        restart: videoControls.querySelector(".vv-restart"),
        skipBack: videoControls.querySelector(".vv-skip-back"),
        skipFwd: videoControls.querySelector(".vv-skip-fwd"),
      },
    };
    this.elements = { ...this.elements, main, video, videoContainer, controls };
    container.appendChild(main);
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  initVideo() {
    const {
      video,
      controls: {
        video: { progress, playPause },
      },
    } = this.elements;
    video.setAttribute("src", this.src);
    video.pause();
    video.oncanplay = this.initControls.bind(this);
    video.ontimeupdate = () => {
      progress.value = video.currentTime;
    };
    video.onended = () => {
      this.isPlaying = false;
      playPause.style.backgroundImage = `url("media/images/play.svg")`;
    };
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  initControls() {
    const {
      main,
      video,

      controls: {
        controlsToggle,
        segment: { prev, next },
        video: { clickCatcher, progress, playPause, stop, restart, skipBack, skipFwd, soundToggle },
      },
    } = this.elements;
    prev.onclick = this.prevSegment.bind(this);
    next.onclick = this.nextSegment.bind(this);
    clickCatcher.onclick = this.togglePlayback.bind(this);
    clickCatcher.onwheel = ((evt) => {
      if (evt.deltaY < 0) this.prevSegment();
      if (evt.deltaY > 0) this.nextSegment();
    }).bind(this);
    playPause.onclick = this.togglePlayback.bind(this);
    stop.onclick = this.stopVideo.bind(this);
    restart.onclick = (() => {
      this.dispatchNotification(`restart`);
      this.scrubVideo(0);
    }).bind(this);
    skipFwd.onclick = (() => {
      this.dispatchNotification(`+${this.skipAmt}`);
      this.scrubVideo(video.currentTime + this.skipAmt);
    }).bind(this);
    skipBack.onclick = (() => {
      this.dispatchNotification(`-${this.skipAmt}`);
      this.scrubVideo(video.currentTime - this.skipAmt);
    }).bind(this);
    soundToggle.onclick = this.toggleSound.bind(this);

    progress.setAttribute("max", video.duration);
    progress.oninput = (evt) => {
      this.scrubVideo(evt.target.value);
    };
    controlsToggle.onclick = this.toggleControls.bind(this);

    const body = document.querySelector("body");
    body.onkeydown = this.handleKeys.bind(this);
    this.resize();
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  togglePlayback() {
    const {
      controls: {
        video: { playPause },
      },
    } = this.elements;
    this.isPlaying = !this.isPlaying;
    const icon = this.isPlaying ? "media/images/pause.svg" : "media/images/play.svg";
    const { video } = this.elements;
    if (this.isPlaying) {
      video.play();
      this.dispatchNotification("Play");
    } else {
      video.pause();
      this.dispatchNotification("Pause");
    }
    playPause.style.backgroundImage = `url(${icon})`;
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  toggleSound() {
    const {
      video,
      controls: {
        video: { soundToggle },
      },
    } = this.elements;
    video.muted = !video.muted;
    if (video.muted) {
      this.dispatchNotification("Muted");
    } else {
      this.dispatchNotification("Unmuted");
    }
    const icon = video.muted ? "media/images/volume-off.svg" : "media/images/volume-on.svg";
    soundToggle.style.backgroundImage = `url(${icon})`;
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  stopVideo() {
    const {
      video,
      controls: {
        video: { playPause },
      },
    } = this.elements;
    video.pause();
    this.scrubVideo(0);
    this.dispatchNotification(`Stop`);
    this.isPlaying = false;
    playPause.style.backgroundImage = `url("media/images/play.svg")`;
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  scrubVideo(time) {
    const { video } = this.elements;
    video.currentTime = time;
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  toggleControls() {
    const {
      controls: {
        controlsToggle,
        video: { container: videoContainer },
        segment: { container: segmentContainer },
      },
    } = this.elements;

    this.showControls = !this.showControls;
    if (!this.showControls) {
      controlsToggle.classList.add("controls-hidden");
      videoContainer.classList.add("hidden");
      segmentContainer.classList.add("hidden");
    } else {
      controlsToggle.classList.remove("controls-hidden");
      videoContainer.classList.remove("hidden");
      segmentContainer.classList.remove("hidden");
    }
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  nextSegment() {
    this.currentSegment = this.currentSegment >= this.segments ? 0 : this.currentSegment + 1;
    this.goToSegment(this.currentSegment);
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  prevSegment() {
    this.currentSegment = this.currentSegment <= 0 ? this.segments : this.currentSegment - 1;
    this.goToSegment(this.currentSegment);
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  goToSegment(segment) {
    const { videoContainer } = this.elements;
    videoContainer.style.top = -(videoContainer.offsetHeight / (this.segments + 1)) * segment + "px";
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  handleKeys(evt) {
    const { video } = this.elements;
    switch (evt.code) {
      case "ArrowRight":
        this.scrubVideo(video.currentTime + this.skipAmt);
        this.dispatchNotification(`+${this.skipAmt}s`);
        break;

      case "ArrowLeft":
        this.scrubVideo(video.currentTime - this.skipAmt);
        this.dispatchNotification(`-${this.skipAmt}s`);
        break;

      case "ArrowUp":
        this.prevSegment();
        break;

      case "ArrowDown":
        this.nextSegment();
        break;

      case "Space":
        this.togglePlayback();
        break;

      case "KeyC":
        this.toggleControls();
        break;

      case "KeyM":
        this.toggleSound();
        break;

      default:
        break;
    }
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  dispatchNotification(text) {
    const {
      controls: {
        notifications: { container, notification },
      },
    } = this.elements;
    notification.innerHTML = text;
    container.classList.remove("hidden");
    clearTimeout(this.notificationTimer);
    this.notificationTimer = setTimeout(() => {
      container.classList.add("hidden");
    }, this.notificationDelay * 1000);
  }
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  resize() {
    const segmentContainer = this.elements.controls.segment.container;
    const videoContainer = this.elements.controls.video.container;
    segmentContainer.style.height = `calc(100% - ${videoContainer.offsetHeight}px)`;
  }
  // --------------------------------------------------------------------------------
}
