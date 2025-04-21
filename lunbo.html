<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>輪播</title>
  <style>
    body { margin: 0; padding: 0; background: #000; }
    .carousel-container {
      width: calc(96% - 10px);
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      border-radius: 10px;
    }
    .carousel {
      display: flex;
      transition: transform .5s ease-in-out;
    }
    .carousel-item {
      flex: 0 0 100%;
      cursor: pointer;
      position: relative;
    }
    .carousel img {
      width: 100%;
      height: 45vw;
      object-fit: cover;
      border-radius: 10px;
      transition: transform 0.4s ease;
    }
    .carousel-buttons {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      justify-content: space-between;
      z-index: 2;
    }
    .carousel-button {
      background: rgba(0,0,0,0);
      color: #fff;
      border: none;
      padding: 10px;
      border-radius: 20%;
    }
    .carousel-indicators {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      z-index: 2;
    }
    .carousel-indicator {
      width: 10px;
      height: 4px;
      background: #808080;
      margin: 0 3px;
      cursor: pointer;
    }
    .carousel-title {
      position: absolute;
      top: 10px;
      left: 10px;
      font-weight: bold;
      background: rgba(0,0,0,0);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 16px;
      z-index: 2;
      display: flex;
      gap: 2px;
    }
    @keyframes zoomInOut {
      0% { transform: scale(1); }
      30% { transform: scale(0.9); }
      100% { transform: scale(1.15); }
    }
    .animate-zoom {
      animation: zoomInOut 0.4s ease;
    }
  </style>
</head>
<body>
<div class="carousel-container">
  <div class="carousel" id="carousel"></div>
  <div class="carousel-buttons">
    <button class="carousel-button" id="prevBtn">〈</button>
    <button class="carousel-button" id="nextBtn">〉</button>
  </div>
  <div class="carousel-indicators" id="carouselIndicators"></div>
  <div class="carousel-title" id="carouselTitle">標題</div>
</div>
<script>
(function(){
  const carousel = document.getElementById("carousel");
  const indicators = document.getElementById("carouselIndicators");
  const titleEl = document.getElementById("carouselTitle");
  const imagesArr = JSON.parse(decodeURIComponent(new URL(location.href).searchParams.get("imgs") || "[]"));
  let currentIndex = 0, interval;

  function getHue(prev) {
    let hue;
    do { hue = Math.floor(Math.random() * 360); } while (Math.abs(hue - prev) < 50);
    return hue;
  }

  function update() {
    carousel.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
    titleEl.innerHTML = "";
    let t = imagesArr[currentIndex].title, prev = -100;
    for (let ch of t) {
      let h = getHue(prev); prev = h;
      let s = document.createElement("span");
      s.style.color = `hsl(${h},100%,75%)`; s.textContent = ch;
      titleEl.appendChild(s);
    }
    indicators.querySelectorAll(".carousel-indicator").forEach((el, i) => {
      el.style.backgroundColor = (i === currentIndex) ? el.dataset.color : "#808080";
    });
  }

  function start() {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % imagesArr.length;
      update();
    }, 3000);
  }

  function reset() {
    clearInterval(interval);
    start();
  }

  imagesArr.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "carousel-item";
    const image = document.createElement("img");
    image.src = decodeURIComponent(img.img);
    image.alt = img.title;

    function zoomEffect() {
      image.classList.add("animate-zoom");
      setTimeout(() => image.classList.remove("animate-zoom"), 400);
    }

    div.addEventListener("click", () => {
      zoomEffect();
      const erUrl = "hiker://page/er?rule=Movieffm🍥&url=" + (img.url || "hiker://empty") + "#immersiveTheme##autoCache##noHistory#";
      fba.open(JSON.stringify({ rule: "er", title: img.title, url: erUrl, extra: { img: img.img } }));
    });

    let pressTimer;
    image.addEventListener("touchstart", () => { pressTimer = setTimeout(zoomEffect, 200); });
    image.addEventListener("touchend", () => clearTimeout(pressTimer));

    div.appendChild(image);
    carousel.appendChild(div);

    const ind = document.createElement("div");
    ind.className = "carousel-indicator";
    ind.dataset.color = `hsl(${Math.floor(Math.random() * 360)},100%,70%)`;
    ind.addEventListener("click", () => { currentIndex = i; update(); reset(); });
    indicators.appendChild(ind);
  });

  document.getElementById("prevBtn").onclick = () => {
    currentIndex = (currentIndex - 1 + imagesArr.length) % imagesArr.length;
    update(); reset();
  };

  document.getElementById("nextBtn").onclick = () => {
    currentIndex = (currentIndex + 1) % imagesArr.length;
    update(); reset();
  };

  update(); start();
})();
</script>
</body>
</html>
