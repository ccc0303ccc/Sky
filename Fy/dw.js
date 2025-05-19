function DW(type) {
    function error(tit1, tit2, type) {
        if (getItem("首页", "off") == "on" && type == "1") {
            refreshPage();
            setItem("Mysye", "首页");
            clearMyVar("Mysou");
            clearMyVar("Myfl");
            return `toast://${tit1}，已切换首页`;
        } else
        if (MY_URL != "http://fenying") {
            return `toast://${tit2}`;
        };
    };

    let dw = type == "2" ? getMyVar("namejs") : getItem("m1");

    function ttlo(name, Json, file, sxtit, type) {
        if (type == "1" && getItem("失效", "on") == "on") {
            const ttlList = Json.map(item => {
                if (item.name.replace(/&&.*/, "") === name) {
                    // 尝试将 ttl 转换成数字，如果转换失败（比如是 "ttl" 或 ""），则设为 0
                    let ttlValue = item.ttl || 0;
                    if (typeof ttlValue !== 'number') {
                        ttlValue = /^\d+$/.test(ttlValue) ? parseInt(ttlValue, 10) : 0;
                    }
                    if ((ttlValue + 1) >= 5) {
                        clearItem("m1");
                        toast(name + " 失效超过5次，已归至失效类");
                    };
                    const newItem = Object.assign({}, item, {
                        ttl: ttlValue + 1,
                        sxtit: sxtit
                    });
                    return newItem;
                }
                return item;
            });
            saveFile(file, JSON.stringify(ttlList));
        }
    };

    function fby(yu, dw, Json, file, tit1, tit2, sxtit, type) {
        if (yu.fbhost != "" && yu.fbhost != undefined || type == "2") {
            let s = type == "2" ? getMyVar("hostjs") : yu.host;
            let syur;
            try {
                syur = new Function(s);
                toast(dw + " - 无法访问，正在重新获取域名！");
            } catch (e) {
                toast(dw + " - 没有发布页");
                //return "hiker://empty";
            };
            if (type == "1") {
                const datedList = Json.map(item => {
                    if (item.name.replace(/&&.*/, "") === dw) {
                        const newItem = Object.assign({}, item, {
                            fbhost: syur()
                        });
                        return newItem;
                    }
                    return item;
                });
                saveFile(file, JSON.stringify(datedList));
            } else {
                try {
                    syur();
                } catch (e) {
                    toast("链接有误或查看网站是否正常访问！");
                    return "hiker://empty";
                };
            };
            refreshPage(false);
            return "hiker://empty";
        } else {
            ttlo(dw, Json, file, sxtit, type);
            return error(tit1, tit2, type);
        };
    };

    function shtml(MY_URL, dw, error, type) {
        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL,
        };

        let htm = JSON.parse(fetch(MY_URL, {
            withStatusCode: true,
            timeout: 5000
        })); //log(htm)
        var ht = htm.body; //log(ht)

        let html;
        if (/检测中/.test(ht)) {
            html = request(MY_URL + "/?btwaf" + ht.match(/btwaf(.*?)\"/)[1], {
                headers: headers
            });
        } else
        if (/滑动验证|拖动滑块/.test(ht)) {
            function stringtoHex(acSTR) {
                var val = "";
                for (var i = 0; i <= acSTR.length - 1; i++) {
                    var str = acSTR.charAt(i);
                    var code = str.charCodeAt();
                    val += parseInt(code) + 1
                };
                return val
            };

            function md5encode(word) {
                return md5(word).toString()
            };
            let jsp = pd(ht, 'script&&src');
            let jsf = request(jsp);
            eval(jsf.match(/key="[^\"]+",value="[^\"]+"/)[0]);
            eval(`let url='${MY_URL}'+` + jsf.match(/"complete",function\(\)\{c\.get\(([^,]+),/)[1]);
            request(url);
            html = request(MY_URL)
        } else
        if (ht == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|番剧|视频|視頻|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|番劇/.test(ht)) {
            if (htm.statusCode != 200) {
                let tit1 = "无法访问";
                let tit2 = "无法访问，请切换首页";
                let sxtit = "无法访问";
                fby(yu, dw, Json, file, tit1, tit2, sxtit);
            } else {
                log(ht);
                let sxtit = "规则失效";
                ttlo(dw, Json, file, sxtit, type);
                let tit1 = "数据错误";
                let tit2 = "数据错误，请切换首页";
                return error(tit1, tit2, type);
            };
        } else {
            html = ht;
        };
        //:gt(1):lt(你想留到第几个);
        //log(html);
        return html;
    };

    function sdw(dw, html, error, type) {
        let biao = (dw, bt1, bt2, bt3, bt4, bt5, bt6) => {
            let pw = dw != undefined ? dw : "h2";
            let b1 = bt1 != undefined ? bt1 : "热门|推荐|精选|热映|热播";
            let b2 = bt2 != undefined ? bt2 : "电影";
            let b3 = bt3 != undefined ? bt3 : "剧集|剧情|连续剧|电视剧";
            let b4 = bt4 != undefined ? bt4 : "综艺";
            let b5 = bt5 != undefined ? bt5 : "动漫|动画|少儿";
            let b6 = bt6 != undefined ? bt6 : "记录|纪录|其它|其他|预告|即将|蓝光|豆瓣|独家|新剧|经典|大片|奈飞|短剧";

            标题1 = pw + ':matches(' + b1 + ') || h3:matches(' + b1 + ') || h4:matches(' + b1 + ')&&Text';
            标题2 = pw + ':matches(' + b2 + ') || h3:matches(' + b2 + ') || h4:matches(' + b2 + ')&&Text';
            标题3 = pw + ':matches(' + b3 + ') || h3:matches(' + b3 + ') || h4:matches(' + b3 + ')&&Text';
            标题4 = pw + ':matches(' + b4 + ') || h3:matches(' + b4 + ') || h4:matches(' + b4 + ')&&Text';
            标题5 = pw + ':matches(' + b5 + ') || h3:matches(' + b5 + ') || h4:matches(' + b5 + ')&&Text';
            标题6 = pw + ':matches(' + b6 + ') || h3:matches(' + b6 + ') || h4:matches(' + b6 + ')&&Text';
        };

        let lie = (dwi, li, di, d2, lt) => {
            let li1 = li[0] != undefined ? li[0] : "0";
            let li2 = li[1] != undefined ? li[1] : "1";
            let li3 = li[2] != undefined ? li[2] : "2";
            let li4 = li[3] != undefined ? li[3] : "3";
            let li5 = li[4] != undefined ? li[4] : "4";
            let li6 = li[5] != undefined ? li[5] : "null";

            let lt1 = lt[0] != undefined ? lt[0] : "4";
            let lt2 = lt[1] != undefined ? lt[1] : "9";
            let lt3 = lt[2] != undefined ? lt[2] : "9";
            let lt4 = lt[3] != undefined ? lt[3] : "9";
            let lt5 = lt[4] != undefined ? lt[4] : "9";
            let lt6 = lt[5] != undefined ? lt[5] : "9";

            let dli = di != undefined ? di : "li";
            let dl2 = d2 != null ? d2 : di != undefined ? di : "li";

            列表1 = dwi + ',' + li1 + '&&' + dl2 + ':lt(' + lt1 + ')'
            列表2 = dwi + ',' + li2 + '&&' + dli + ':lt(' + lt2 + ')'
            列表3 = dwi + ',' + li3 + '&&' + dli + ':lt(' + lt3 + ')'
            列表4 = dwi + ',' + li4 + '&&' + dli + ':lt(' + lt4 + ')'
            列表5 = dwi + ',' + li5 + '&&' + dli + ':lt(' + lt5 + ')'
            列表6 = dwi + ',' + li6 + '&&' + dli + ':lt(' + lt6 + ')'
        };

        if (/module-list/.test(html)) {
            biao();
            let dw1 = ".module-list";
            let li = [];
            let dw2 = ".module-item";
            let lt = [];
            lie(dw1, li, dw2, null, lt);
        } else
        if (/module-items/.test(html)) {
            biao();

            let dw1 = ".module-items";
            let li = [];
            let dw2 = ".module-item";
            let lt = [];
            lie(dw1, li, dw2, null, lt);
        } else
        if (/tab-list/.test(html)) {
            biao();

            let dw1 = ".module";
            let li = [];
            let dw2 = ".tab-list&&a";
            let d2 = "a";
            let lt = [];
            lie(dw1, li, dw2, d2, lt);
        } else
        if (/scroll-box/.test(html)) {
            biao();

            let dw1 = ".module";
            let li = [];
            let dw2 = ".module-items&&a";
            let lt = [];
            lie(dw1, li, dw2, null, lt);
        } else
        if (/stui-vodlist/.test(html)) {
            biao();

            let dw1 = ".stui-vodlist";
            let li = [];
            let dw2 = "li";
            let lt = ["6", "6", "6", "6", "6"];
            lie(dw1, li, dw2, null, lt);
        } else
        if (/public-list-box/.test(html)) {

            biao();

            let dw1 = ".border-box";
            let li = [];
            let dw2 = ".public-list-box";
            let lt = [];
            lie(dw1, li, dw2, null, lt);
        } else
        if (/hl-vod-list/.test(html)) {
            let ww = /往往影视/.test(dw);

            biao("h2", "热播", "电影", "电视剧", "动漫");

            let dw1 = ".hl-vod-list";
            let li = ["0", "1", "2", "3", "null", "null"];
            let dw2 = "li";
            let lt = [];
            lie(dw1, li, dw2, null, lt);
        } else {
            let tit1 = "模板匹配失败";
            let tit2 = "模板匹配失败，请联系作者";
            return error(tit1, tit2, type);
        };
        return 标题1 + "$" + 标题2 + "$" + 标题3 + "$" + 标题4 + "$" + 标题5 + "$" + 标题6 + "$$" + 列表1 + "$$" + 列表2 + "$$" + 列表3 + "$$" + 列表4 + "$$" + 列表5 + "$$" + 列表6;
    };

    let html;
    let 标题1;
    let 标题2;
    let 标题3;
    let 标题4;
    let 标题5;
    let 标题6;

    let 轮播;
    let 列表1;
    let 列表2;
    let 列表3;
    let 列表4;
    let 列表5;
    let 列表6;

    let 列表;
    let 片名;
    let 更新;
    let 图片;
    let 链接;
    let 样式;
    let yu = type == "2" ? getMyVar("namejs").replace(/&&.*/, "") : Json.find(item => item.name.replace(/&&.*/, "") === dw);

    let Js = type == "2" ? getMyVar("gs", gsValue) == "JS" : yu.gs == "JS";

    let HOst = type == "2" ? getMyVar("gs", gsValue) == "HOST" : yu.gs == "HOST";

    if (Js) {
        let so;
        let g;
        if (type == "2") {
            so = getMyVar("syjs");
            g = getMyVar("gyjs");
        } else {
            so = yu.sy;
            g = yu.gy;
        };

        var 公用;
        if (typeof g != 'undefined') {
            try {
                公用 = eval("(" + g + ")");
            } catch (e) {
                公用 = null;
            };
        };
        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL,
        };
        let s = so.replace(/html\s*\=\s*fetch\(MY\_URL\)/, "html = JSON.parse(fetch(MY_URL, { withStatusCode: true, timeout: 5000, headers: headers}))");
        var status = /withStatusCode/.test(s);
        let ss = status ? s : so;
        eval(ss);
        if (typeof 免嗅 == "string" ? 免嗅 == "on" : false) {
            if (公用 && typeof 公用.免嗅 == "function") {
                try {
                    var mx = 公用.免嗅.toString();
                } catch (e) {
                    log(e.toString());
                };
            };
            if (公用 && typeof 公用.点播 == "string") {
                var db = 公用.点播;
            };
            if (公用 && typeof 公用.排除 == "object") {
                var ex = 公用.排除;
            };
            if (公用 && typeof 公用.包含 == "object") {
                var bh = 公用.包含;
            };
            if (公用 && typeof 公用.广告 == "object") {
                try {
                    var gg = 公用.广告;
                } catch (e) {
                    log(e.toString());
                };
            };
        } else
        if (typeof 正文 == "string" ? 正文 == "on" : false) {
            if (公用 && typeof 公用.正文 == "function") {
                try {
                    var zw = 公用.正文.toString();
                } catch (e) {
                    log(e.toString());
                };
            };
        };

        htm = status ? html.body : html;
        let ison;
        try {
            var ht = JSON.parse(htm);
            ison = "on";
        } catch (e) {
            ison = "off";
        };

        if (公用 && typeof 公用.验证 == "function" && (typeof 验证 == "function" ? 验证(htm) : false)) {
            try {
                公用.验证(htm, MY_URL);
            } catch (e) {
                log(e.toString());
            };
            deleteItemByCls("cls_load");
        } else
        if (htm == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|音乐|歌|DJ|MV|番剧|漫画|说|相声|书|小品|视频|視頻|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|音樂|歌|番劇|漫畫|說|相聲|書|小藝/.test(htm) && ison != "on" || ison == "on" && (typeof(ht) == "string" ? ht.code != 200 : "")) {
            if (MY_PAGE == 1) {
                if ((status ? html.statusCode : htm) != 200) {
                    let tit1;
                    let tit2;
                    let sxtit;
                    if (status) {
                        tit1 = "无法访问";
                        tit2 = "无法访问，请切换首页";
                        sxtit = "无法访问";
                    } else {
                        tit1 = "无法访问或数据错误";
                        tit2 = "无法访问或数据错误，请切换首页";
                        sxtit = "无法访问或规则失效"
                    };
                    fby(yu, dw, Json, file, tit1, tit2, sxtit, type);
                } else {
                    log(html);
                    let sxtit = "规则失效";
                    ttlo(dw, Json, file, sxtit, type);
                    let tit1 = "数据错误";
                    let tit2 = "数据错误，请切换首页";
                    return error(tit1, tit2, type);
                }
            };
        } else {
            html = htm;
        };
    };
    if (HOst) {
        html = shtml(MY_URL, dw, error, type);
        let bt = sdw(dw, html, error, type);
        标题1 = bt.split("$")[0];
        标题2 = bt.split("$")[1];
        标题3 = bt.split("$")[2];
        标题4 = bt.split("$")[3];
        标题5 = bt.split("$")[4];
        标题6 = bt.split("$")[5];

        列表1 = bt.split("$$")[1];
        列表2 = bt.split("$$")[2];
        列表3 = bt.split("$$")[3];
        列表4 = bt.split("$$")[4];
        列表5 = bt.split("$$")[5];
        列表6 = bt.split("$$")[6];
    };

    try {
        let 轮列;
        try {
            轮列 = typeof(轮播) == "object" ? 轮播 : typeof(轮播) == "function" ? 轮播(html) : /&&/.test(轮播) ? pdfa(html, 轮播) : null;
        } catch (e) {
            轮列 = null;
        };
        let 精列;
        try {
            精列 = typeof(列表1) == "object" ? 列表1 : typeof(列表1) == "function" ? 列表1(html) : /&&/.test(列表1) ? pdfa(html, 列表1) : null;
        } catch (e) {
            精列 = null;
        };
        let 电列;
        try {
            电列 = typeof(列表2) == "object" ? 列表2 : typeof(列表2) == "function" ? 列表2(html) : /&&/.test(列表2) ? pdfa(html, 列表2) : null;
        } catch (e) {
            电列 = null;
        };
        let 剧列;
        try {
            剧列 = typeof(列表3) == "object" ? 列表3 : typeof(列表3) == "function" ? 列表3(html) : /&&/.test(列表3) ? pdfa(html, 列表3) : null;
        } catch (e) {
            剧列 = null;
        };
        let 综列;
        try {
            综列 = typeof(列表4) == "object" ? 列表4 : typeof(列表4) == "function" ? 列表4(html) : /&&/.test(列表4) ? pdfa(html, 列表4) : null;
        } catch (e) {
            综列 = null;
        };
        let 动列;
        try {
            动列 = typeof(列表5) == "object" ? 列表5 : typeof(列表5) == "function" ? 列表5(html) : /&&/.test(列表5) ? pdfa(html, 列表5) : null;
        } catch (e) {
            动列 = null;
        };
        let 其列;
        try {
            其列 = typeof(列表6) == "object" ? 列表6 : typeof(列表6) == "function" ? 列表6(html) : /&&/.test(列表6) ? pdfa(html, 列表6) : null;
        } catch (e) {
            其列 = null;
        };

        let 轮标 = typeof(轮播) == "string" ? (!/&&/.test(轮播) ? "禁用" : "轮播") : null;
        let 推荐 = 精列 != null && 精列.length != 0 ? (!/&&/.test(标题1) ? 标题1 : pdfh(html, 标题1)) : null;
        let 电影 = 电列 != null && 电列.length != 0 ? (!/&&/.test(标题2) ? 标题2 : pdfh(html, 标题2)) : null;
        let 剧集 = 剧列 != null && 剧列.length != 0 ? (!/&&/.test(标题3) ? 标题3 : pdfh(html, 标题3)) : null;
        let 综艺 = 综列 != null && 综列.length != 0 ? (!/&&/.test(标题4) ? 标题4 : pdfh(html, 标题4)) : null;
        let 动漫 = 动列 != null && 动列.length != 0 ? !/&&/.test(标题5) ? 标题5 : pdfh(html, 标题5) : null;
        let 其它 = 其列 != null && 其列.length != 0 ? !/&&/.test(标题6) ? 标题6 : pdfh(html, 标题6) : null;

        var 待标 = [轮标, 推荐, 电影, 剧集, 综艺, 动漫, 其它]; //log(待标)
        var 待列 = [轮列, 精列, 电列, 剧列, 综列, 动列, 其列]; //log(待列)
    } catch (e) {
        log(e.toString());
        ttlo(dw, Json, file, "规则失效", type);
        let tit1 = "列表有误";
        let tit2 = "列表有误，请联系作者";
        return error(tit1, tit2, type);
    };


    function ldw(dw, 待列) {
        片名 = 'a&&title'
        链接 = 'a&&href'

        if (/m-pic-l/.test(待列)) {
            更新 = '.m-pic-l&&span&&Text'
        } else
        if (/public-list-prb|text-right|videoul-tips|fed-list-remarks|list-remarks|module-item-text|module-item-note|pic-text|cor4|cor5|hdtag|hl-pic-text|pic-tag-left|packscore|list-tag|ft2|c3/.test(待列)) {
            更新 = '.public-list-prb||.videoul-tips||.fed-list-remarks||.list-remarks||.module-item-text||.module-item-note||.pic-text||.cor4||.cor5||.hdtag||.hl-pic-text||.pic-tag-left||.packscore||.list-tag||.ft2||.text-right||.c3&&Text'
        }

        if (/hl-lazy|videoul-img|eclazy|fed-lazy/.test(待列)) {
            图片 = '.videoul-img||.hl-lazy||.eclazy||.fed-lazy&&data-original||lay-src||data-src'
        } else
        if (/lazyload|lazy/.test(待列)) {
            图片 = '.lazyload||.lazy&&data-original||data-src||src'
        } else {
            图片 = 'img&&data-original||data-src||src'
        };
        return 片名 + "$" + 更新 + "$" + 图片 + "$" + 链接;
    };

    if (HOst) {
        let dw1 = ldw(dw, 待列);
        片名 = dw1.split("$")[0];
        更新 = dw1.split("$")[1];
        图片 = dw1.split("$")[2];
        链接 = dw1.split("$")[3];
    };

    try {
        let 列;
        if (Js) {
            列 = typeof(列表) == "undefined" ? 列表显示(待列) : 列表(待列);
        } else {
            列 = [];
            for (let j of 待列) {
                let li = j;
                let lists = [];
                for (let i in li) {
                    let pic = pdfh(li[i], 图片);
                    let img = (/.*url=|.*tu=/.test(pic) ? pic.replace(/.*url=|.*tu=/, "") : (/http|pic|jpg|png|jpeg|\//.test(pic)) ? pd(li[i], 图片) : "hiker://images/home_bg") + "@Referer=";
                    let title = pdfh(li[i], 片名);
                    let url = pd(li[i], 链接);
                    let desc = pdfh(li[i], 更新);
                    lists.push(title + '$' + desc + '$' + img + '$' + url);
                }
                列.push(lists);
            };
        };
        var sy = {
            "标": 待标,
            "列": 列,
            "样": typeof(样式) != "undefined" ? 样式.toString() : "",
            "免": typeof(mx) != "undefined" ? mx : "",
            "文": typeof(zw) != "undefined" ? zw : "",
            "开": typeof(免嗅) != "undefined" ? 免嗅 : typeof(正文) != "undefined" ? 正文 : "",
            "点": typeof(db) != "undefined" ? db : "",
            "排": typeof(ex) != "undefined" ? ex : "",
            "含": typeof(bh) != "undefined" ? bh : "",
            "广": typeof(gg) != "undefined" ? gg : "",
            "变": typeof(变色) != "undefined" ? 变色 : ""
        };
        if (type == "1") {
            saveFile("hiker://files/cache/FY/sy/" + base64Encode(dw) + ".js", JSON.stringify(sy), 0);
        };
        return sy;
    } catch (e) {
        log(e.toString());
        ttlo(dw, Json, file, "规则失效", type);
        let tit1 = "内容有误";
        let tit2 = "内容有误，请联系作者";
        return error(tit1, tit2, type);
    };
};
