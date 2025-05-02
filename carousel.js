function dpush(d, images) {
    const path = getPath("hiker://files/_cache/lunbo.html");
    const html = (() => {
        const safeImgs = images.map(img => ({
            img: img.img || 'https://via.placeholder.com/600x400',
            title: img.title || '無標題',
            url: img.url || ''
        }));
        return `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>輪播</title>
<style>
body{margin:0;overflow:visible;background:transparent;}
.carousel-container{position:relative;width:93%;height:45vw;margin:0 auto;overflow:hidden;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,.35);}
.slice-container{position:absolute;width:100%;height:100%;display:flex;top:0;left:0;z-index:1;border-radius:12px;overflow:hidden;}
.slice{width:20%;height:100%;overflow:hidden;position:relative;}
.slice img{position:absolute;width:500%;height:100%;object-fit:cover;top:0;left:0;transition:transform 1s ease;}
.full-img{width:100%;height:100%;object-fit:cover;}
.title{position:absolute;top:8px;left:12px;font-size:16px;font-weight:bold;z-index:3;max-width:90%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:1px 1px 0 #000,2px 2px 2px rgba(0,0,0,.4);}
.arrow{position:absolute;top:50%;transform:translateY(-50%);font-size:14px;color:white;z-index:4;padding:4px 8px;user-select:none;}
.arrow-left{left:0;}
.arrow-right{right:0;}
.indicator-container{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;z-index:3;}
.indicator{width:6px;height:6px;background:rgba(255,255,255,0.5);border-radius:50%;margin:0 3px;transition:all .3s;}
.indicator.active{transform:scale(1.5);background:#fff;}
@keyframes horizontal-shake {
  0%   { transform: translateX(0); }
  10%  { transform: translateX(6px); }
  20%  { transform: translateX(-6px); }
  30%  { transform: translateX(4px); }
  40%  { transform: translateX(-4px); }
  50%  { transform: translateX(2px); }
  60%  { transform: translateX(-2px); }
  70%  { transform: translateX(1px); }
  80%  { transform: translateX(0); }
  100% { transform: translateX(0); }
}

@keyframes vertical-shake {
  0%   { transform: translateY(0); }
  10%  { transform: translateY(6px); }
  20%  { transform: translateY(-6px); }
  30%  { transform: translateY(4px); }
  40%  { transform: translateY(-4px); }
  50%  { transform: translateY(2px); }
  60%  { transform: translateY(-2px); }
  70%  { transform: translateY(1px); }
  80%  { transform: translateY(0); }
  100% { transform: translateY(0); }
}
.shake{animation:horizontal-shake .8s;}
.shake-vertical{animation:vertical-shake .8s;}
</style>
</head><body>
<div class="carousel-container" id="carousel">
<div class="title" id="carousel-title"></div>
<div class="arrow arrow-left" id="prev-btn">〈</div>
<div class="arrow arrow-right" id="next-btn">〉</div>
<div class="indicator-container" id="indicator-container"></div>
</div>
<script>
const images=${JSON.stringify(safeImgs)};
let index=0,autoTimer,isColorful=true,isAnimating=false,isVertical=false;
const container=document.getElementById("carousel");
const titleElem=document.getElementById("carousel-title");
const indicatorContainer=document.getElementById("indicator-container");
const SLICE_COUNT=5,indicatorColors=[];

function renderRainbowTitle(text,idx){
  titleElem.innerHTML="";
  if(!isColorful){titleElem.textContent=text;titleElem.style.color="#fff";return;}
  const base=Math.floor(Math.random()*360);
  const colors=[];
  for(let i=0;i<text.length;i++){
    const span=document.createElement("span");
    span.textContent=text[i];
    const color=\`hsl(\${(base+i*40)%360},100%,75%)\`;
    span.style.color=color;
    colors.push(color);
    titleElem.appendChild(span);
  }
  indicatorColors[idx]=colors[Math.min(colors.length-1,idx)];
}

function createSlices(url,direction){
  const wrap=document.createElement("div");
  wrap.className="slice-container";
  for(let i=0;i<SLICE_COUNT;i++){
    const slice=document.createElement("div");
    slice.className="slice";
    const img=document.createElement("img");
    img.src=url;
    img.style.left=(-i*100)+"%";
    if(direction==="next") img.style.transform=(i%2===0)?"translateX(100%)":"translateX(-100%)";
    if(direction==="prev") img.style.transform=(i%2===0)?"translateX(-100%)":"translateX(100%)";
    if(direction==="vertical") img.style.transform=(i%2===0)?"translateY(100%)":"translateY(-100%)";
    slice.appendChild(img);wrap.appendChild(slice);
  }
  return wrap;
}

function switchImage(newIndex, direction="next"){
  if(isAnimating)return;
  isAnimating=true;
  const cur=images[index],nxt=images[newIndex];
  const cSlices=createSlices(cur.img,"none");
  const nSlices=createSlices(nxt.img,direction);
  container.querySelectorAll(".slice-container,a").forEach(e=>e.remove());
  container.appendChild(cSlices);container.appendChild(nSlices);
  renderRainbowTitle(nxt.title,newIndex);updateIndicators(newIndex);
  setTimeout(()=>{
    cSlices.querySelectorAll("img").forEach((img,i)=>{
      img.style.transform=direction==="vertical"?(i%2===0?"translateY(-100%)":"translateY(100%)"):(i%2===0?"translateX(-100%)":"translateX(100%)");
    });
    nSlices.querySelectorAll("img").forEach(img=>img.style.transform="translate(0)");
  },50);
  setTimeout(()=>{
  cSlices.remove();
  nSlices.remove();
  const a=document.createElement("a");
  a.href=decodeURIComponent(nxt.url);
  a.dataset.url=nxt.url;
  const img=document.createElement("img");
  img.src=nxt.img;
  img.className="full-img";
  a.appendChild(img);
  container.appendChild(a);

  // 加入標題震動動畫
  titleElem.classList.add(isVertical ? "shake-vertical" : "shake");
  setTimeout(() => titleElem.classList.remove(isVertical ? "shake-vertical" : "shake"), 500);

  index=newIndex;
  isAnimating=false;
  }, 1050);
}

function updateIndicators(idx){
  const ind=indicatorContainer.querySelectorAll(".indicator");
  ind.forEach((el,i)=>{
    el.classList.toggle("active",i===idx);
    el.style.background=i===idx?(indicatorColors[i]||"#fff"):"rgba(255,255,255,0.5)";
  });
}

function createIndicators(){
  images.forEach((_,i)=>{
    const el=document.createElement("div");
    el.className="indicator";
    el.onclick=()=>{switchImage(i,i>index?"next":"prev");resetAutoPlay();};
    indicatorContainer.appendChild(el);
  });
  updateIndicators(index);
}

document.getElementById("prev-btn").onclick=()=>{
  switchImage((index-1+images.length)%images.length,isVertical?"vertical":"prev");
  shake();resetAutoPlay();
};
document.getElementById("next-btn").onclick=()=>{
  switchImage((index+1)%images.length,isVertical?"vertical":"next");
  shake();resetAutoPlay();
};

function shake(){
  container.classList.add(isVertical?"shake-vertical":"shake");
  setTimeout(()=>container.classList.remove(isVertical?"shake-vertical":"shake"),500);
}

let longTimer;
container.ontouchstart=()=>{longTimer=setTimeout(()=>{isVertical=!isVertical;shake();},800);};
container.ontouchend=()=>clearTimeout(longTimer);
container.onclick=(e)=>{
  if(e.target.tagName==="IMG"||e.target.tagName==="A"){
    e.preventDefault();
    const cur=images[index];
    fba.open(JSON.stringify({rule:"er",title:cur.title,url:decodeURIComponent(cur.url),extra:{img:cur.img}}));
  }
};

titleElem.onclick=()=>{
  isColorful=!isColorful;
  renderRainbowTitle(images[index].title,index);
  titleElem.classList.add("shake");
  setTimeout(()=>titleElem.classList.remove("shake"),500);
};

function autoPlay(){
  autoTimer=setInterval(()=>{switchImage((index+1)%images.length,isVertical?"vertical":"next");},5000);
}
function resetAutoPlay(){clearInterval(autoTimer);autoPlay();}

window.onload=()=>{
  const first=document.createElement("a");
  first.href=decodeURIComponent(images[index].url);first.dataset.url=images[index].url;
  const img=document.createElement("img");
  img.src=images[index].img;img.className="full-img";
  first.appendChild(img);container.appendChild(first);
  renderRainbowTitle(images[index].title,index);
  createIndicators();autoPlay();
};
</script></body></html>`;
    })();
    writeFile(path, html);
    const px = fetch("hiker://files/cache/Windh.txt") || "188";
    d.push({
        col_type: "x5_webview_single",
        url: path,
        desc: "list&&" + px
    });
}