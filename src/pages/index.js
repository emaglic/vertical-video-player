import "./index.scss";
import VerticalVideo from "src/components/VerticalVideo";
let verticalVideo = null;
let importer = null;
let segments = null;
let aspect = null;

window.onload = () => {
  const aspectSelect = document.querySelector(".aspect-select");
  aspect = aspectSelect.value;
  aspectSelect.onchange = (evt) => {
    aspect = evt.target.value;
  };
  importer = document.querySelector(".import-file");
  importer.onchange = (evt) => {
    const segmentEl = document.querySelector(".segments-num");
    segments = segmentEl ? segmentEl.value : 1;
    let file = evt.target.files[0];
    let blobURL = URL.createObjectURL(file);
    const container = document.querySelector(".vertical-video-container");
    verticalVideo = new VerticalVideo({ container, src: blobURL, segments, aspect });
    const importContainer = document.querySelector(".import-container");
    importContainer.classList.add("hidden");
  };
};

window.onresize = () => {
  if (verticalVideo) verticalVideo.resize();
};
