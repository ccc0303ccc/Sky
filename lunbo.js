function show(d, list, cfg) {
    const htmlPath = "hiker://files/_cache/lunbo.html";
    const data = {
        images: list,
        config: cfg
    };

    writeFile(htmlPath, "<!DOCTYPE html><html><body></body></html>");

    d.push({
        col_type: "x5_webview_single",
        desc: "list&&188",
        url: htmlPath,
        extra: {
            ua: MOBILE_UA,
            js: $.toString((data) => {
                const images = data.images;
                const cfg = data.config;

                document.body.innerHTML = `
                <style>
                    *{margin:0;padding:0}body{font-family:sans-serif;}
                    .carousel-container{width:calc(100% - 10px);margin:auto;position:relative;overflow:hidden;border-radius:10px;}
                    .carousel{display:flex;transition:transform .5s ease-in-out;}
                    .carousel-item{flex:0 0 100%;cursor:pointer;}
                    .carousel img{width:100%;height:45vw;object-fit:cover;border-radius:10px;}
                    .carousel-buttons{position:absolute;top:50%;width:100%;display:flex;justify-content:space-between;z-index:2;}
                    .carousel-button{background:rgba(0,0,0,0.2);color:#fff;border:none;padding:10px;border-radius:50%;}
                    .carousel-indicators{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;z-index:2;}
                    .carousel-indicator{width:10px;height:4px;margin:0 3px;cursor:pointer;background:#808080;}
                    .carousel-title{position:absolute;top:10px;left:10px;color:#fff;background:rgba(0,0,0,.3);padding:4px 10px;border-radius:20px;font-size:16px;z-index:2;}
                </style>
                <div class="carousel-container">
                    <div class="carousel" id="carousel"></div>
                    <div class="carousel-buttons">
                        <button class="carousel-button" id="prevBtn">〈</button>
                        <button class="carousel-button" id="nextBtn">〉</button>
                    </div>
                    <div class="carousel-indicators" id="indicators"></div>
                    <div class="carousel-title" id="carouselTitle">標題</div>
                </div>`;

                const carousel = document.getElementById("carousel");
                const indicators = document.getElementById("indicators");
                const titleEl = document.getElementById("carouselTitle");

                let currentIndex = 0;
                const colors = images.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));

                images.forEach((img, i) => {
                    const item = document.createElement("div");
                    item.className = "carousel-item";
                    item.innerHTML = `<img src="${decodeURIComponent(img.img)}" alt="${img.title}">`;
                    item.onclick = () => {
                        const url = img.url || "hiker://empty";
                        const link = cfg.url.replace("{url}", url) + (cfg.mark || "");
                        fba.open(JSON.stringify({
                            rule: "er",
                            title: img.title,
                            url: link,
                            extra: { img: img.img }
                        }));
                    };
                    carousel.appendChild(item);

                    const indicator = document.createElement("div");
                    indicator.className = "carousel-indicator";
                    indicator.style.background = "#808080";
                    indicator.dataset.color = colors[i];
                    indicator.onclick = () => {
                        currentIndex = i;
                        update();
                        reset();
                    };
                    indicators.appendChild(indicator);
                });

                function update() {
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                    titleEl.textContent = images[currentIndex].title;
                    indicators.querySelectorAll(".carousel-indicator").forEach((el, i) => {
                        el.style.background = (i === currentIndex) ? el.dataset.color : "#808080";
                    });
                }

                function start() {
                    interval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % images.length;
                        update();
                    }, 3000);
                }

                function reset() {
                    clearInterval(interval);
                    start();
                }

                document.getElementById("prevBtn").onclick = () => {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    update(); reset();
                };

                document.getElementById("nextBtn").onclick = () => {
                    currentIndex = (currentIndex + 1) % images.length;
                    update(); reset();
                };

                let interval;
                update();
                start();
            }, data)
        }
    });
}
