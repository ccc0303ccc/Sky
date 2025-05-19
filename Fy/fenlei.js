function fenlei(type) {
    addListener("onClose", $.toString(() => {
        clearMyVar("Myfl");
        clearMyVar("sd_zh");
        clearMyVar("Myurl.url");
        clearMyVar("Myurl.title");
        clearMyVar("flxz1");
        clearMyVar("class");
        clearMyVar("area");
        clearMyVar("sort");
        clearMyVar("lang");
        clearMyVar("year");
        clearMyVar("letter");
        clearMyVar("type");
        clearMyVar("dwtype");
    }));
    let s = [];
    let d = [];
    let xl = [];

    let dwfl = type == "2" ? getMyVar("namejs").replace(/&&.*/, "") : getItem("m1");
    let v = getMyVar("sd_zh", "0") == "0";
    let names = type == "2" ? getMyVar("namejs") : Json.find(item => item.name.replace(/&&.*/, "") === dwfl);
    let cesy = type == "2" ? getMyVar("syjs") : names.sy;
    let page = MY_PAGE;
    MY_URL = cesy == "*" ? getMyVar("flurl") : MY_URL.split("#")[1];
    let col = getItem("fl0", "三列") == "双列" ? "movie_2" : "movie_3_marquee";
    putMyVar("dwtype", type);

    require(config.依赖.replace(/[^/]*$/, "fdw.js"));

    if (parseInt(page) == 1) {
        let pic1 = "hiker://files/cache/FY/image/";
        let title;
        let url;
        let 标链 = typeof(标题链接) != "undefined" ? 标题链接 : typeof(标题) != "undefined" ? 标题 : "";
        if (typeof(标链) == "object") {
            title = Object.keys(标链);
            url = Object.values(标链);
        } else {
            title = ["电影", "剧集", "动漫", "综艺", "短剧"];
            let 电影u = typeof(电影) != "undefined" ? 电影 : typeof(电影_url) != "undefined" ? 电影_url : "";
            let 剧集u = typeof(剧集) != "undefined" ? 剧集 : typeof(剧集_url) != "undefined" ? 剧集_url : "";
            let 动漫u = typeof(动漫) != "undefined" ? 动漫 : typeof(动漫_url) != "undefined" ? 动漫_url : "";
            let 综艺u = typeof(综艺) != "undefined" ? 综艺 : typeof(综艺_url) != "undefined" ? 综艺_url : "";
            let 短剧u = typeof(短剧) != "undefined" ? 短剧 : typeof(短剧_url) != "undefined" ? 短剧_url : "";

            url = [电影u, 剧集u, 动漫u, 综艺u, 短剧u];
        };
        let img = ["电影", "剧集", "综艺", "动漫", "其它", "分类"];
        let 链 = url.filter(item => item !== "");
        let len = 链.length;
        let flei = getMyVar("Myfl", title[0]);
        for (let i = 0; i < len; i++) {
            (cesy != "*" ? (v ? s : d) : d).push({
                title: (cesy != "*" ? (/5|4|3|1/.test(len) || len > 6 ? "‘‘’’" : "") : "‘‘’’") + "<b>" + (flei == title[i] ? flei.fontcolor("#FA7298") : title[i]) + "</b>",
                img: pic1 + (/虎牙/.test(title[i]) ? "虎牙" : /斗鱼/.test(title[i]) ? "斗鱼" : /网易/.test(title[i]) ? "网易" : /哔哩|bili|B站/.test(title[i]) ? "哔哩" : /快手/.test(title[i]) ? "快手" : /抖音/.test(title[i]) ? "抖音" : /更新/.test(title[i]) ? "更新" : /排行/.test(title[i]) ? "排行" : /热门/.test(title[i]) ? "热播" : /库|分类|类型/.test(title[i]) ? "分类" : img[i]) + ".png",
                col_type: cesy != "*" ? (len == 6 ? "icon_small_3" : len == 5 ? "icon_5" : len == 4 ? "icon_5" : len == 3 ? "icon_small_4" : len == 2 ? "icon_small_3" : len == 1 ? "icon_2" : len == 0 ? "avatar" : "scroll_button") : "scroll_button",
                url: $(链[i] + "#noLoading#").lazyRule((fen) => {
                    //let new_cate = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
                    refreshPage(false);
                    clearMyVar("Myurl.title");
                    clearMyVar("class");
                    clearMyVar("area");
                    clearMyVar("sort");
                    clearMyVar("lang");
                    clearMyVar("year");
                    clearMyVar("letter");
                    clearMyVar("type");
                    putMyVar("Myfl", fen);
                    //putMyVar("Myurl.title", JSON.stringify(new_cate));
                    putMyVar("Myurl.url", input);
                    return "hiker://empty"
                }, title[i])
            });
        };

        if (len < 5) {
            (cesy != "*" ? (v ? s : d) : d).push({
                title: (cesy != "*" ? (/4|3|1/.test(len) ? "‘‘’’" : "") : "‘‘’’") + "<b>" + getItem("fl0", "三列") + "</b>",
                desc: "<b>切换排列</b>\t",
                url: $("#noLoading#").lazyRule((len, cesy) => {
                    if (getItem("fl0", "三列") == "双列") {
                        clearItem("fl0");
                    } else {
                        setItem("fl0", "双列");
                    };

                    let list = findItemsByCls("cls_flys") || [];
                    if (list.length == 0) {
                        return "hiker://empty";
                    };

                    if (!/movie\_2|movie\_3\_marquee/.test(list[0].type)) return "toast://此排列不支持切换";

                    updateItem("id_flsx", {
                        title: (cesy ? (/4|3|1/.test(len) ? "‘‘’’" : "") : "‘‘’’") + "<b>" + getItem("fl0", "三列") + "</b>"
                    })

                    let col = getItem("fl0", "三列") == "双列" ? "movie_2" : "movie_3_marquee";
                    for (let li of list) {
                        let id = li.extra.id
                        updateItem(id, {
                            col_type: col
                        })
                    };
                    return "hiker://empty";
                }, len, cesy !== "*" ? true : false),
                img: pic1 + "分类排列.png",
                col_type: cesy != "*" ? (len == 4 ? "icon_5" : len == 3 ? "icon_small_4" : len == 2 ? "icon_small_3" : len == 1 ? "icon_2" : len == 0 ? "avatar" : "blank_block") : "scroll_button",
                extra: {
                    id: "id_flsx"
                }
            });
        };
        d.push({
            col_type: "big_blank_block"
        });

        if (v && !/验证码|安全验证/.test(Js ? html : ht)) {
            s.push({
                col_type: "rich_text",
                extra: {
                    cls: "cls_load"
                }
            }, {
                img: pic1 + "Loading.gif",
                url: "hiker://empty",
                col_type: "pic_1_center",
                extra: {
                    cls: "cls_load"
                }
            })
        };
        cesy != "*" ? (v ? setPreResult(s) : null) : null;

        //分类定位
        let 小 = typeof(小类) != "undefined" ? 小类 : typeof(拼接小类) != "undefined" ? 拼接小类 : "";
        let 子 = typeof(分类子) != "undefined" ? 分类子 : typeof(子类) != "undefined" ? 子类 : "";
        let d名 = typeof(大名) != "undefined" ? 大名 : typeof(大类名) != "undefined" ? 大类名 : "";
        let x名 = typeof(小名) != "undefined" ? 小名 : typeof(小类名) != "undefined" ? 小类名 : "";
        let d链 = typeof(大链) != "undefined" ? 大链 : typeof(大类链) != "undefined" ? 大类链 : "";
        let x链 = typeof(小链) != "undefined" ? 小链 : typeof(小类链) != "undefined" ? 小类链 : "";
        let h大链 = typeof(换大链) != "undefined" ? 换大链 : typeof(大类链替换) != "undefined" ? 大类链替换 : "";
        let h小链 = typeof(换小链) != "undefined" ? 换小链 : typeof(小类链替换) != "undefined" ? 小类链替换 : "";

        let categories;
        try {
            categories = typeof(大类) == "function" ? 大类().concat(typeof(小) == "function" ? 小() : pdfa(html, 小)) : pdfa(html, 大类).concat(pdfa(html, 小));
        } catch (e) {
            try {
                categories = typeof(大类) == "function" ? 大类() : pdfa(html, 大类);
            } catch (e) {
                categories = "";
            }
        };
        //log(categories);
        const Color = "#19B89D";
        /*let init_cate = [];
        for (let i = 0; i < 20; i++) {
            init_cate.push("0")
        };*/
        let init_cate = new Array(20).fill("0");
        const fold = getMyVar("Myurl.group", "0");
        const cate_temp_json =
            getMyVar("Myurl.title", JSON.stringify(init_cate));
        const cate_temp = JSON.parse(cate_temp_json);
        if (categories != "" && html != "") {
            d.push({
                col_type: "big_blank_block"
            }, {
                title: "‘‘’’<small><b>" + (fold === '1' ? "收起➥".fontcolor("#FA7298") : "展开➦".fontcolor("#19B89D")) + "</b></small>",
                url: $('#noLoading#').lazyRule(() => {
                    putMyVar("Myurl.group", getMyVar("Myurl.group") === '1' ? '0' : '1');
                    let fol = getMyVar("Myurl.group");
                    updateItem("id_fykg", {
                        title: "‘‘’’<small><b>" + (fol == '1' ? "收起➥".fontcolor("#FA7298") : "展开➦".fontcolor("#19B89D")) + "</b></small>"
                    });
                    if (fol == "1") {
                        let lis = storage0.getMyVar("flxz1", []).map(x => {
                            x['col_type'] = x['col_type'] ? x['col_type'] : x['type'];
                            return x;
                        }); //log(lis);
                        addItemAfter("id_fyxz", lis);
                    } else {
                        deleteItemByCls("cls_fy" + MY_RULE.title);
                    };
                    return "hiker://empty";
                }),
                col_type: "scroll_button",
                extra: {
                    id: "id_fykg"
                }
            });
            try {
                categories.forEach((category, index) => {
                    let sub_categories = pdfa(category, 子);
                    if (index === 0) {
                        sub_categories.forEach((item, key) => {
                            let title = pdfh(item, d名);
                            d.push({
                                title: "‘‘’’<small>" + (key.toString() === cate_temp[index] ? "<b>" + title.fontcolor(Color) + "</b>" : title) + "</small>",
                                url: $(typeof(h大链) == "function" ? h大链(pd(item, d链)) + '#noLoading#' : pd(item, d链) + "#noLoading#").lazyRule((params) => {
                                    let new_cate = [];
                                    params.cate_temp.forEach((cate, index) => {
                                        new_cate.push(index === 0 ? params.key.toString() : "0")
                                    })
                                    putMyVar("Myurl.title", JSON.stringify(new_cate));
                                    if (/@@@/.test(input)) {
                                        putMyVar(input.split("@@@")[0].replace(/.*###/, ""), input.split("@@@")[1]);
                                    } else {
                                        putMyVar("Myurl.url", input);
                                    };
                                    refreshPage(false);
                                    return "hiker://empty";
                                }, {
                                    cate_temp: cate_temp,
                                    key: key,
                                    page: page,
                                }),
                                col_type: 'scroll_button'
                            })
                        })
                        d.push({
                            col_type: "blank_block",
                            extra: {
                                id: "id_fyxz"
                            }
                        });
                    } else
                    if (fold) {
                        sub_categories.
                        forEach((item, key) => {
                            let title = pdfh(item, x名);
                            xl.push({
                                title: "‘‘’’<small>" + (key.toString() === cate_temp[index] ? "<b>" + title.fontcolor(Color) + "</b>" : title) + "</small>",
                                url: $((typeof(h小链) == "function" ? h小链(pdfh(item, x链), item) : pd(item, x链)) + "#noLoading#").lazyRule((params) => {
                                    params.cate_temp[params.index] = params.key.toString();
                                    putMyVar("Myurl.title", JSON.stringify(params.cate_temp));

                                    if (/@@@/.test(input)) {
                                        putMyVar(input.split("@@@")[0].replace(/.*###/, ""), input.split("@@@")[1]);
                                    } else {
                                        putMyVar("Myurl.url", input);
                                    };
                                    refreshPage(false);
                                    return "hiker://empty";
                                }, {
                                    cate_temp: cate_temp,
                                    index: index,
                                    key: key,
                                    page: page,
                                }),
                                col_type: "scroll_button",
                                extra: {
                                    cls: "cls_fy" + MY_RULE.title
                                }
                            });
                        });
                        xl.push({
                            col_type: "blank_block",
                            extra: {
                                cls: "cls_fy" + MY_RULE.title
                            }
                        });
                    };
                });
                storage0.putMyVar('flxz1', xl);
                if (fold === '1') {
                    let listx = storage0.getMyVar('flxz1', []);
                    //log(listx)
                    for (let o in listx) {
                        let u = listx[o]
                        d.push({
                            title: u.title,
                            url: u.url,
                            col_type: u.col_type,
                            extra: u.extra
                        });
                    };
                };
                d.push({
                    col_type: "line"
                }, {
                    col_type: "big_blank_block",
                });
                deleteItemByCls("cls_load");
            } catch (e) {
                if (page == 1 && !/验证码|安全验证/.test(Js ? html : ht)) {
                    toast("没有分类或匹配有误");
                    log(e.toString());
                };
            };
        };
    };

    let list;
    let 显列 = typeof(列表) != "undefined" ? 列表 : typeof(显示列表) != "undefined" ? 显示列表 : "";
    try {
        list = Js ? 显列(html) : pdfa(html, 列表);
    } catch (e) {
        list = "";
    };
    if (list == "") {
        if (page == 1 && !/验证码|安全验证/.test(Js ? html : ht)) {
            toast("没有列表或匹配有误");
            log(html);
        };
    } else {
        try {
            let 排 = typeof(ex) != "undefined" ? ex.toString() : "";
            let 排除ex = 排 != "" ? 排.replace(/\\/g, "").replace(/^\//, "").replace(/\/$/, "") : "";
            let m3u8 = getItem("缓存") == "on" ? true : false;
            let extr;
            if (/function/.test(mx) && (typeof 免嗅 == "string" ? 免嗅 == "on" : false)) {
                extr = {
                    js: $.toString((点播) => {
                        if (点播 != "undefined" && 点播 != "") {
                            eval(点播.replace(/\'/g, ""));
                        };
                    }, db),
                    videoExcludeRules: [".html", 排除ex],
                    blockRules: [".gif", ".jpeg", ".jpg", ".ico", ".png", "hm.baidu.com", "/ads/*.js", "cnzz.com"],
                    jsLoadingInject: true,
                    /*ua: PC_UA,*/
                    cacheM3u8: m3u8
                };
            };

            let lxn = getItem("lx1", "全部");
            let lxna = /影视|动漫|短剧|网盘/.test(lxn) ? "影视" : /听书|音乐/.test(lxn) ? "听书" : /全部|其它/.test(lxn) ? "其它" : lxn;
 
            let fxlj = "hiker://page/fxlj?rule=百度云盘&realurl=";
            let login = "hiker://page/login?rule=百度云盘&realurl=";           
            if (Js) {
                list.forEach(li => {
                    let title = li.title;
                    let im = li.img;
                    let img = isBase64(im) == true && im !== "undefined" ? base64Decode(im) : decodeURIComponent(im);
                    let desc = li.desc;
                    let urls = li.url;

                    let url = /@lazyRule=|@rule=/.test(urls) ? urls : urls == "hiker://empty" ? urls : (/function/.test(mx) && 免嗅 == "on") ? $("hiker://empty").lazyRule((nad, game, MY_HOME, url, type) => {
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return mx(url, nad, MY_HOME, game, url, type);
                    }, dwfl, game, MY_HOME, urls, type) : (/function/.test(zw) && 正文 == "on") ? $(urls + "#readTheme#").rule((nad, game, MY_HOME, type) => {
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return zw(nad, MY_URL, MY_HOME, game, type);
                    }, dwfl, game, MY_HOME, type) : /magnet:|\.torrent|ed2k:|pan\.xunlei/.test(urls) ? "hiker://page/diaoyong?rule=迅雷&page=fypage#" + urls : /ali(pan|yun)/.test(urls) ? "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(urls) : /(quark|\.uc)\.cn/.test(urls) ? "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(urls) + "&sharePwd=" : /baidu/.test(urls) ? (fetch(fxlj) == "" ? login : fxlj) + urls : /cloud\.189|yun\.139|www\.123[a-zA-Z\d]{3}\.com/.test(urls) ? $("hiker://empty#noHistory#").rule((url) => {
                        let d = [];
                        putMyVar("fypanys", "1");
                        require(config.依赖.replace(/[^/]*$/, "pan.js"));
                        hs(url, d, url);
                        setResult(d);
                    }, urls) : $("hiker://empty##" + urls + "#immersiveTheme##noHistory##autoCache" + game).rule(() => {
                        require(config.依赖);
                        erji()
                    });
                    let tit = title !== undefined ? title.replace(/\n.*/, "") : title;
                    let des = desc !== undefined ? desc.replace(/\n.*/, "") : desc;
                    let extra = Object.assign({}, extr, {
                        id: "id_" + list.length + title,
                        cls: "cls_flys",
                        inheritTitle: false,
                        pageTitle: tit + "「" + dwfl + "」",
                        title: tit,
                        desc: des,
                        img: img,
                        type: type,
                        longClick: [{
                            title: "加入周更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("zgb", name);
                                setItem("fyzg", "周更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "周更");

                            }, lxna, tit, des, img, base64Encode(url), dwfl)
                        }, {
                            title: "加入日更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("zgb", name);
                                setItem("fyzg", "日更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "日更");

                            }, lxna, tit, des, img, base64Encode(url), dwfl)
                        }, {
                            title: "加入完更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("zgb", name);
                                setItem("fyzg", "完更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "完更");

                            }, lxna, tit, des, img, base64Encode(url), dwfl)
                        }]
                    });
                    d.push({
                        title: title,
                        desc: desc,
                        img: img,
                        url: url,
                        col_type: typeof(li.col_type) != "undefined" ? li.col_type : col,
                        extra: extra
                    })
                });
            } else {
                list.forEach(li => {
                    let title = pdfh(li, 片名);
                    let picc = pdfh(li, 图片);
                    let im = (/.*url\=http|.*tu=http/.test(picc) ? picc.replace(/.*url=|.*tu=/g, "") : (/http|pic|jpg|png|jpeg|\//.test(picc)) ? pd(li, 图片) : "hiker://images/home_bg") + "@Referer=";
                    let img = isBase64(im) == true && im !== "undefined" ? base64Decode(im) : decodeURIComponent(im);
                    let desc = pdfh(li, 更新);
                    let urls = pd(li, 链接).replace("vodplay", "voddetail").replace(/project-(\d+)/, "v_$1_1_1");

                    let url = $("hiker://empty##" + urls + "#immersiveTheme##noHistory##autoCache" + game).rule(() => {
                        require(config.依赖);
                        erji()
                    });
                    let tit = title !== undefined ? title.replace(/\n.*/, "") : title;
                    let des = desc !== undefined ? desc.replace(/\n.*/, "") : desc;
                    let extra = Object.assign({}, extr, {
                        id: "id_" + li.length + title,
                        cls: "cls_flys",
                        inheritTitle: false,
                        pageTitle: tit + "「" + dwfl + "」",
                        title: tit,
                        desc: des,
                        img: img,
                        type: type,
                        longClick: [{
                            title: "加入周更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("fyzg", "周更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "周更");

                            }, lxna, tit, des, img, base64Encode(url), dwfl)
                        }, {
                            title: "加入日更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("fyzg", "日更")
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "日更");

                            }, lxna, tit, des, img, base64Encode(url), dwfl)
                        }, {
                            title: "加入完更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("fyzg", "完更")
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "完更");

                            }, lxna, tit, des, img, base64Encode(url), dwfl)
                        }]
                    });
                    d.push({
                        title: title,
                        desc: desc,
                        img: img,
                        url: url,
                        col_type: col,
                        extra: extra
                    })
                });
            };
            //log(list)
            deleteItemByCls("cls_load");
        } catch (e) {
            log(e.toString());
            d.push({
                desc: "““内容匹配有误””",
                url: "hiker://empty",
                col_type: "text_center_1",
                extra: {
                    lineVisible: false
                }
            })
        };
        putMyVar("sd_zh", "1");
    };
    setResult(d);
};
//动态分类来自模板Q
//by随风  优化样式及匹配模板😜😜😜
