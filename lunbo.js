const CAROUSEL_WRAPPER = ".animation-1&&.item";
const IMG_SELECTOR = "img||a&&data-lazy-src||data-original";
const TITLE_SELECTOR = "h3&&Text||.title&&Text";
const LINK_SELECTOR = "a&&href";

function dpush(d, images) {
    const path = getPath("hiker://files/_cache/lunbo.html");
    writeFile(path, "");
    const px = fetch("hiker://files/cache/Windh.txt") || "188";

    d.push({
        col_type: "x5_webview_single",
        url: path,
        desc: "list&&" + px,
        extra: {
            ua: MOBILE_UA,
            js: $.toString(function(images) {
                function getHtml(imgs) {
                    return `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;}
.carousel-container{width:calc(96% - 10px);margin:0 auto;position:relative;overflow:hidden;border-radius:10px;}
.carousel{display:flex;transition:transform .5s ease-in-out;}
.carousel-item{flex:0 0 100%;cursor:pointer;position:relative;transition:transform 0.4s ease;}
.carousel-item img{width:100%;height:45vw;object-fit:cover;border-radius:10px;}
.carousel-buttons{position:absolute;top:50%;transform:translateY(-50%);width:100%;display:flex;justify-content:space-between;z-index:2;}
.carousel-button{background:rgba(0,0,0,0);color:#fff;border:none;padding:10px;border-radius:20%;}
.carousel-indicators{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;z-index:2;}
.carousel-indicator{width:10px;height:4px;background:#808080;margin:0 3px;cursor:pointer;}
.carousel-title{position:absolute;top:10px;left:10px;font-weight:bold;background:rgba(0,0,0,.1);padding:2px 8px;border-radius:20px;font-size:16px;line-height:1.5;z-index:2;display:flex;gap:2px;}
@keyframes zoomInOut {
  0% {transform: scale(1);}
  30% {transform: scale(0.9);}
  100% {transform: scale(1.15);}
}
.animate-zoom {animation: zoomInOut 0.4s ease;}
</style>
</head><body>
<div class="carousel-container">
<div class="carousel" id="carousel" data-images='${JSON.stringify(imgs)}'></div>
<div class="carousel-buttons"><button class="carousel-button" id="prevBtn">〈</button><button class="carousel-button" id="nextBtn">〉</button></div>
<div class="carousel-indicators" id="carouselIndicators"></div>
<div class="carousel-title" id="carouselTitle">標題</div>
</div></body></html>`;
                }

                document.documentElement.innerHTML = getHtml(images);
                const carousel = document.getElementById("carousel");
                const indicators = document.getElementById("carouselIndicators");
                const titleEl = document.getElementById("carouselTitle");
                const imagesArr = JSON.parse(carousel.dataset.images);
                let currentIndex = 0, interval;

                let useRainbow = localStorage.getItem("useRainbowColor") !== "false";

                function getHue(prev) {
                    let hue;
                    do {
                        hue = Math.floor(Math.random() * 360);
                    } while (Math.abs(hue - prev) < 50);
                    return hue;
                }

                function update() {
                    carousel.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
                    titleEl.innerHTML = "";
                    let t = imagesArr[currentIndex].title, prev = -100;

                    for (let ch of t) {
                        let s = document.createElement("span");
                        s.style.color = useRainbow ? `hsl(${getHue(prev)},100%,75%)` : "#fff";
                        prev = useRainbow ? getHue(prev) : prev;
                        s.textContent = ch;
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
                    const a = document.createElement("a");
                    a.className = "carousel-item";
                    a.href = "#"; // 防止直接跳網頁
                    a.dataset.url = decodeURIComponent(img.url); // 真正網址

                    const image = document.createElement("img");
                    image.src = decodeURIComponent(img.img);
                    image.alt = img.title;
                    a.appendChild(image);

                    function zoomEffect() {
                        a.classList.add("animate-zoom");
                        setTimeout(() => a.classList.remove("animate-zoom"), 400);
                    }

                    a.addEventListener("click", (e) => {
                        e.preventDefault();
                        zoomEffect();
                        fba.open(JSON.stringify({
                            rule: "er",
                            title: img.title,
                            url: a.dataset.url,
                            extra: {
                                img: img.img
                            }
                        }));
                    });

                    let pressTimer;
                    a.addEventListener("touchstart", () => {
                        pressTimer = setTimeout(zoomEffect, 200);
                    });
                    a.addEventListener("touchend", () => clearTimeout(pressTimer));

                    carousel.appendChild(a);

                    const ind = document.createElement("div");
                    ind.className = "carousel-indicator";
                    ind.dataset.color = `hsl(${Math.floor(Math.random() * 360)},100%,70%)`;
                    ind.addEventListener("click", () => {
                        currentIndex = i;
                        update();
                        reset();
                    });
                    indicators.appendChild(ind);
                });

                document.getElementById("prevBtn").onclick = () => {
                    currentIndex = (currentIndex - 1 + imagesArr.length) % imagesArr.length;
                    update();
                    reset();
                };
                document.getElementById("nextBtn").onclick = () => {
                    currentIndex = (currentIndex + 1) % imagesArr.length;
                    update();
                    reset();
                };

                titleEl.addEventListener("click", () => {
                    useRainbow = !useRainbow;
                    localStorage.setItem("useRainbowColor", useRainbow);
                    update();
                });

                update();
                start();
            }, images)
        }
    });
}

function getCarouselData() {
    var d = [];
    var html = request(MY_URL.replace("hiker://empty##", ""));
    var list = pdfa(html, CAROUSEL_WRAPPER).map(function(x) {
        return {
            title: pdfh(x, TITLE_SELECTOR),
            img: pd(x, IMG_SELECTOR) + "@Referer=&lazyLoad=true",
            url: pd(x, LINK_SELECTOR)
        };
    }).filter(x => x.title && x.img && x.url).map(function(x) {
        x.img = x.img.startsWith("http") ? x.img : new URL(x.img, MY_URL).href;
        const rawUrl = x.url.startsWith("http") ? x.url : new URL(x.url, MY_URL).href;
        x.url = "hiker://page/er?rule=Movieffm🍥&url=" + rawUrl + "#immersiveTheme##autoCache##noHistory#";
        return x;
    });

    dpush(d, list);
    return d;
}

getCarouselData();
