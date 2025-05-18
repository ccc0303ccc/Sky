//123列表
function lists123(myurl, host, d, size, code, next, fid, otype, fwm) {
    let data = JSON.parse(fetchPC(buildUrl(host + "/b/api/share/get", {
        "limit": "999",
        "next": next,
        "orderBy": "file_name",
        "orderDirection": "asc",
        "shareKey": code,
        "SharePwd": fwm,
        "ParentFileId": fid,
        "Page": "1",
        "event": "homeListFile",
        "operateType": otype
    })).replace(/\"Size\":(\d+)/g, '"Size":"$1"').replace(/\"FileId\":(\d+)/g, '"FileId":"$1"'));
    //log(data)

    if (data.data == null) {
        d.push({
            title: "<br>",
            col_type: "rich_text"
        }, {
            desc: "数据未获取到\n可能分享被取消或和谐",
            col_type: "text_center_1",
            url: "hiker://empty",
            extra: {
                lineVisible: false
            }
        })
        return
    };

    let nexts = data.data.Next;
    let col = getItem("fyyanshi", "avatar");
    let cotxt = (col, txt) => {
        return /movie/.test(col) ? txt.replace(/\d{2}:\d{2}:\d{2}/, "") : /avatar/.test(col) ? `<small>${txt.replace(/\d{2}:\d{2}:\d{2}/, "")}</small>` : `‘‘’’<small>${txt}</small>`;
    };
    let btget = getItem("zgb", "影视");
    let get = btget == "影视" ? "ys" : btget == "小说" ? "xs" : btget == "其它" ? "qt" : btget == "漫画" ? "mh" : btget == "听书" ? "ts" : "";
    let zfda;
    if (getItem("zf", "f") == "z") {
        zfda = data.data.InfoList;
    } else {
        zfda = data.data.InfoList.reverse();
    };
    zfda.forEach((li) => {
        if (li.Size == "0") {
            d.push({
                title: `<small>${li.FileName}</small>`,
                desc: `<small>${li.UpdateAt.replace(/\+.*/, "").replace("T", " ")}</small>`,
                img: "hiker://images/icon_folder3",
                url: $("hiker://empty#noHistory#").rule((myurl, host, code, next, fid, fwm) => {
                    let d = [];
                    require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                    tyyshi(d, "123");

                    try {
                        lists123(myurl, host, d, size, code, next, fid, "4", fwm);
                    } catch (e) {
                        log(toString(e));
                        d.push({
                            title: "<br>",
                            col_type: "rich_text"
                        }, {
                            desc: "文件夹为空",
                            col_type: "text_center_1",
                            url: "hiker://empty",
                            extra: {
                                lineVisible: false
                            }
                        })
                    };
                    setResult(d)
                }, myurl, host, code, nexts, li.FileId, fwm),
                col_type: "avatar"
            })
        } else {
            //log(li)
            let name = li.FileName;
            if (!/nfo$/i.test(name)) {
                let pic = li.DownloadUrl;
                d.push({
                    title: `${cotxt(col, name)}`,
                    desc: `${cotxt(col, li.UpdateAt.replace(/T.*/, ""))}\t${cotxt(col, size(li.Size))}`,
                    img: /\.(mp3|flac|ogg|m4a|wav|opus)$/i.test(name) ? "hiker://images/icon_music3" : pic == "" ? "hiker://images/icon_zip2" : pic,
                    url: $("hiker://empty").lazyRule((get, myurl, jm, pics, host, code, fid, Sizes, flag, tag) => {

                        if (getMyVar("fys", "") == "0") {
                            require(config.依赖.replace(/[^/]*$/, "public.js"));
                            zuji(get, myurl, jm);
                        };
                        require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                        return lazy123(host, jm, pics, code, fid, Sizes, flag, tag);

                    }, get, myurl, name, pic, host, code, li.FileId, li.Size, li.S3KeyFlag, li.Etag),
                    col_type: col,
                    extra: {
                        id: li.FileId
                    }
                })
            };
        };
    })
};

//123播放
function lazy123(host, jm, pics, code, fid, Sizes, flag, tag) {

    let tk = fetch("hiker://files/rules/FYJK/ck/123.txt");
    if (tk == "") {
        return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
            require(config.依赖.replace(/[^/]*$/, "pan.js"));
            dlu();
        });
    };

    let audio = /\.(mp3|flac|ogg|m4a|wav|opus)$/i;
    let movie = /\.(mp4|mkv|avi|mov|rmvb|webm|flv|m4v|m3u8)$/i;
    let pic = /\.(jpg|png|jpeg|gif|svg|raw)$/i;

    if (pic.test(jm)) {
        return `pics://${pics}`;
    } else {
        //原画
        let dow = JSON.parse(postPC(host + "/b/api/share/download/info", {
            headers: {
                "platform": "android",
                "Authorization": tk
            },
            body: {
                "ShareKey": code,
                "FileID": fid,
                "S3keyFlag": flag,
                "Size": Sizes,
                "Etag": tag
            }
        }));
        //log(dow)

        if (dow.message == "请登录后下载") {
            return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
                require(config.依赖.replace(/[^/]*$/, "pan.js"));
                dlu();
            });
        };

        let params = dow.data.DownloadURL;
        //log(play)
        let de64 = base64Decode(params.replace(/.*params=(.*?)&is.*/, "$1")); //log(plas)

        let play = JSON.parse(fetchPC(de64, {
            onlyHeaders: true
        })); //log(play)

        //转码
        if (movie.test(jm)) {
            let zlay = JSON.parse(fetchPC(buildUrl(host + "/b/api/video/play/info", {
                "etag": tag,
                "size": Sizes,
                "from": "1",
                "shareKey": code
            }), {
                headers: {
                    "platform": "android",
                    "Authorization": tk
                }
            })); //log(zlay)
            let vide = zlay.data.video_play_info || [];
            let names = [];
            let urls = [];
            vide.forEach((li) => {
                if (li.url !== "") {
                    names.push(li.resolution)
                    urls.push(li.url)
                }
            });

            return JSON.stringify({
                names: ["原画"].concat(names),
                urls: [play.url].concat(urls)
            }) + "#isVideo=true#";
        } else
        if (audio.test(jm)) {
            return play.url + "#isMusic=true#";
        } else {
            return `download://${play.url}`;
        };
    };
};

//移动列表
function ydlists(myurl, d, size, code, pCaID) {
    let lists = postPC("https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/getOutLinkInfoV6", {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8",
            "X-Deviceinfo": "||3|12.27.0|chrome|126.0.0.0|1||windows 10|980X1791|zh-CN|||",
            "hcy-cool-flag": "1"
        },
        body: JSON.stringify(encrypt(JSON.stringify({
            "getOutLinkInfoReq": {
                "account": "",
                "linkID": code,
                "passwd": "",
                "caSrt": 0,
                "coSrt": 0,
                "srtDr": 1,
                "bNum": 1,
                "pCaID": pCaID,
                "eNum": 200
            },
            "commonAccountInfo": {
                "account": "",
                "accountType": 1
            }
        })))
    });
    let list = JSON.parse(decrypt(lists)).data; //log(list)

    if (list == null) {
        d.push({
            title: "<br>",
            col_type: "rich_text"
        }, {
            desc: "数据未获取到\n可能分享被取消或和谐",
            col_type: "text_center_1",
            url: "hiker://empty",
            extra: {
                lineVisible: false
            }
        })
        return
    };

    let Dates = (str) => {
        return str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8) + " " + str.slice(8, 10) + ":" + str.slice(10, 12) + ":" + str.slice(12)
    };

    if (list.caLst !== null) {
        let calis = list.caLst.sort((a, b) => a.caName.localeCompare(b.caName));

        let zfca;
        if (getItem("zf", "f") == "z") {
            zfca = calis;
        } else {
            zfca = calis.reverse();
        };
        zfca.forEach((li) => {
            if (!/App-我的-活动中心-免费1T空间和免流/.test(li.caName)) {
                d.push({
                    title: `<small>${li.caName}</amall>`,
                    desc: `<small>${Dates(li.udTime)}</amall>`,
                    img: "hiker://images/icon_folder3",
                    url: $("hiker://empty#noHistory#").rule((myurl, code, pCaID) => {
                        let d = [];
                        require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                        tyyshi(d, "移动");

                        try {
                            ydlists(myurl, d, size, code, pCaID);
                        } catch (e) {
                            log(toString(e));
                            d.push({
                                title: "<br>",
                                col_type: "rich_text"
                            }, {
                                desc: "文件夹为空",
                                col_type: "text_center_1",
                                url: "hiker://empty",
                                extra: {
                                    lineVisible: false
                                }
                            })
                        };
                        setResult(d)
                    }, myurl, code, li.path),
                    col_type: "avatar"
                })
            };
        });
    };

    let col = getItem("fyyanshi", "avatar");
    let btget = getItem("zgb", "影视");
    let get = btget == "影视" ? "ys" : btget == "小说" ? "xs" : btget == "其它" ? "qt" : btget == "漫画" ? "mh" : btget == "听书" ? "ts" : "";
    let cotxt = (col, txt) => {
        return /movie/.test(col) ? txt.replace(/\d{2}:\d{2}:\d{2}/, "") : /avatar/.test(col) ? `<small>${txt.replace(/\d{2}:\d{2}:\d{2}/, "")}</small>` : `‘‘’’<small>${txt}</small>`;
    };

    if (list.coLst !== null) {
        list.coLst.sort((a, b) => {
            let numA, numB;
            if (/((S\d+)?(E\.?|EP)|第)\d+/.test(a.coName)) {
                numA = parseInt(a.coName.match(/(第|EP?\.?)(\d+)/)[2], 10);
            } else {
                numA = parseInt(a.coName.match(/\d+/)[0], 10);
            }

            if (/((S\d+)?(E\.?|EP)|第)\d+/.test(b.coName)) {
                numB = parseInt(b.coName.match(/(第|EP?\.?)(\d+)/)[2], 10);
            } else {
                numB = parseInt(b.coName.match(/\d+/)[0], 10);
            }
            return numA - numB;
        });

        let zfco;
        if (getItem("zf", "f") == "z") {
            zfco = list.coLst;
        } else {
            zfco = list.coLst.reverse();
        };
        zfco.forEach((li) => {
            //log(li)
            let Type = li.coType;
            if (/0|1|2|3/.test(li.coType)) {
                d.push({
                    title: `${cotxt(col, li.coName)}`,
                    desc: cotxt(col, Dates(li.udTime)) + cotxt(col, size(li.coSize)),
                    img: Type == "2" ? "hiker://images/icon_music3" : Type == "0" ? "hiker://images/icon_zip2" : li.bthumbnailURL,
                    url: $("hiker://empty").lazyRule((get, myurl, jm, code, coid, path, img, Type) => {
                        if (getMyVar("fys", "") == "0") {
                            require(config.依赖.replace(/[^/]*$/, "public.js"));
                            zuji(get, myurl, jm);
                        };
                        require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                        return ydlazy(code, coid, path, img, Type);
                    }, get, myurl, li.coName, code, li.coID, li.path, li.bthumbnailURL, Type),
                    col_type: col,
                    extra: {
                        id: li.coID
                    }
                })
            }
        });
    };
};

//移动播放
function ydlazy(code, coid, path, img, Type) {
    let cok = fetch("hiker://files/rules/FYJK/ck/移动.txt");
    //log(cok)    
    let ount;
    let auth;
    if (cok !== "") {
        auth = cok.split("authorization=")[1].split(";")[0];
        ount = cok.split("###")[1]; //log(ount)
    }
    /* else
        if (getItem("panqx", "zm") == "yh" && Type == "3") {
            return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
                require(config.依赖.replace(/[^/]*$/, "pan.js"));
                dlu();
            });
        };*/

    let yhurl;
    if (Type == "1") {
        return `pics://${img}`;
    } else
    if (ount != undefined && Type == "3" /* && getItem("panqx", "zm") == "yh"*/ || Type == "0") {
        //原画
        let data = JSON.stringify(encrypt(JSON.stringify({
            "dlFromOutLinkReqV3": {
                "account": ount,
                "linkID": code,
                "coIDLst": {
                    "item": [path]
                }
            },
            "commonAccountInfo": {
                "account": ount,
                "accountType": 1
            }
        })));

        let res = postPC("https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/dlFromOutLinkV3", {
            headers: {
                "authorization": auth,
                "hcy-cool-flag": "1",
                "accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=UTF-8",
                "X-Deviceinfo": "||3|12.27.0|chrome|126.0.0.0|c4b240bc4a7732a9de76dff785a2f6be||windows 10|384X702|zh-CN|||"
            },
            body: data
        });
        let plas = JSON.parse(decrypt(res)); //log(plas)
        if (Type == "0") {
            return "download://" + plas.data.redrUrl;
        } else {
            yhurl = plas.data.redrUrl;
        };
    };
    if (Type == "3" || Type == "2") {
        //视频转码 音频
        let data = JSON.stringify({
            "getContentInfoFromOutLinkReq": {
                "contentId": coid,
                "linkID": code,
                "account": ""
            },
            "commonAccountInfo": {
                "account": "",
                "accountType": 1
            }
        }); //log(data)

        let resp = JSON.parse(postPC('https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/getContentInfoFromOutLink', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'application/json'
            },
            body: data
        })).data;
        //log(resp)
        let play = resp.contentInfo.presentURL;

        if (Type == "2") {
            return play + "#isMusic=true#";
        } else {
            let red = fetchPC(play).replace(/stream/gs, `${play.split("playlist")[0]}stream`);
            //log(red)

            let uat = red.replace(/#EXT-X-STREAM-INF.*?(?=#EXT-X-STREAM-INF)/gs, ""); //log(uat)

            let nat = red.match(/RESOLUTION=(\d+\D\d+)\,/gs);

            let nam = nat.map(match => match.replace(/RESOLUTION=(\d+\D\d+)\,/gs, "$1")); //log(nam)

            let urls = nam.map((li) => {
                let url = uat.replace(/(\d+)\/index/, `${play.split("playlist")[0]}${li.replace(/.*?x/, "")}/index`).replace(/RESOLUTION=(\d+\D\d+)\,/, `RESOLUTION=${li},`); //log(url)           

                let u = startProxyServer($.toString(() => {
                    let url = base64Decode(MY_PARAMS.url);
                    //log("我在代理" + url);                
                    return url;
                }));
                return u + "?url=" + base64Encode(url) + "#.m3u8";
            });

            let name = (yhurl ? ["原画"].concat(nam) : nam).map(item => {
                return item.replace(/.*?x/, "");
            });

            return JSON.stringify({
                names: name,
                urls: yhurl ? [yhurl].concat(urls) : urls
            }) + "#isVideo=true#";
        };
    };
};

//移动加解密
eval(getCryptoJS());
// 加密
function encrypt(data) {
    let key = CryptoJS.enc.Utf8.parse("PVGDwmcvfs1uV3d1"); // 16字节
    let words = [];
    for (let i = 0; i < 16; i += 4) {
        words.push(Math.floor(Math.random() * 0x100000000));
    };
    let t = CryptoJS.lib.WordArray.create(words, 16),
        n = "";
    if ("string" == typeof data) {
        let o = CryptoJS.enc.Utf8.parse(data);
        n = CryptoJS.AES.encrypt(o, key, {
            iv: t,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    } else if (typeof data === 'object' && data !== null) {
        let a = JSON.stringify(data),
            s = CryptoJS.enc.Utf8.parse(a);
        n = CryptoJS.AES.encrypt(s, key, {
            iv: t,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    }
    return CryptoJS.enc.Base64.stringify(t.concat(n.ciphertext));
};

// 解密
function decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse("PVGDwmcvfs1uV3d1"); // 16字节
    let t = CryptoJS.enc.Base64.parse(data),
        n = t.clone(),
        i = n.words.splice(4);
    n.init(n.words), t.init(i);
    let o = CryptoJS.enc.Base64.stringify(t),
        a = CryptoJS.AES.decrypt(o, key, {
            iv: n,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }),
        s = a.toString(CryptoJS.enc.Utf8);
    return s.toString();
};

//天翼列表
function lists(myurl, host, fid, sid, fol, smd, d, size, fwm) {
    //获取列表请求
    let list = JSON.parse(fetch(buildUrl(host + "/api/open/share/listShareDir.action", {
        "pageNum": 1,
        "pageSize": 999,
        "fileId": fid,
        "isFolder": fol,
        "shareId": sid,
        "shareMode": smd,
        "iconOption": 5,
        "orderBy": "lastOpTime",
        "descending": true,
        "accessCode": fwm
    }), {
        headers: {
            "Accept": "application/json;charset=UTF-8",
            "Referer": host
        }
    }).replace(/\"id\":(\d+)/g, '"id":"$1"'));
    //log(list)       

    let folis;
    try {
        folis = list.fileListAO.folderList.sort((a, b) => a.name.localeCompare(b.name)); //log(folis)
    } catch (e) {
        log(toString(e));
        folis = [];
    };

    let listt;
    try {
        listt = list.fileListAO.fileList.sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
        log(toString(e));
        listt = [];
    };

    let zffo;
    let zfli;
    if (getItem("zf", "f") == "z") {
        zffo = folis;
        zfli = listt; //log(zfli)
    } else {
        zffo = folis.reverse();
        zfli = listt.reverse();
    };

    //文件夹
    zffo.forEach((li) => {
        d.push({
            title: `<small>${li.name}</amall>`,
            desc: `<small>${li.lastOpTime}</small>`,
            img: "hiker://images/icon_folder3",
            url: $("hiker://empty#noHistory#").rule((myurl, host, fid, sid, fol, smd, fwm) => {
                let d = [];
                require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                tyyshi(d, "天翼");

                try {
                    lists(myurl, host, fid, sid, fol, smd, d, size, fwm);
                } catch (e) {
                    log(toString(e));
                    d.push({
                        title: "<br>",
                        col_type: "rich_text"
                    }, {
                        desc: "文件夹为空",
                        col_type: "text_center_1",
                        url: "hiker://empty",
                        extra: {
                            lineVisible: false
                        }
                    })
                };
                setResult(d)
            }, myurl, host, li.id, sid, fol, smd, fwm),
            col_type: "avatar"
        })
    });

    let col = getItem("fyyanshi", "avatar");
    let cotxt = (col, txt) => {
        return /movie/.test(col) ? txt.replace(/\d{2}:\d{2}:\d{2}/, "") : /avatar/.test(col) ? `<small>${txt.replace(/\d{2}:\d{2}:\d{2}/, "")}</small>` : `‘‘’’<small>${txt}</small>`;
    };
    let btget = getItem("zgb", "影视");
    let get = btget == "影视" ? "ys" : btget == "小说" ? "xs" : btget == "其它" ? "qt" : btget == "漫画" ? "mh" : btget == "听书" ? "ts" : "";
    //列表
    zfli.forEach((li) => {
        let type = li.mediaType;
        if (/0|1|2|3/.test(type) && !/nfo$/i.test(li.name)) {
            let img = type == "2" ? "hiker://images/icon_music3" : type == "0" ? "hiker://images/icon_video2" : li.icon.largeUrl;
            d.push({
                title: `${cotxt(col, li.name)}`,
                img: img,
                desc: `${cotxt(col, li.lastOpTime)}\t${cotxt(col, size(li.size))}`,
                url: $("hiker://empty").lazyRule((get, myurl, host, fid, sid, img, name, type) => {
                    if (getMyVar("fys", "") == "0") {
                        require(config.依赖.replace(/[^/]*$/, "public.js"));
                        zuji(get, myurl, name);
                    };
                    require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                    return tylazy(host, fid, sid, img, name, type);
                }, get, myurl, host, li.id, sid, img, li.name, type),
                col_type: col,
                extra: {
                    id: li.id
                }
            })
        };
    })
};

//天翼播放
function tylazy(host, fid, sid, img, name, type) {
    let dlu = () => {
        return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
            require(config.依赖.replace(/[^/]*$/, "pan.js"));
            dlu();
        });
    };

    let api;
    if (type == "2") {
        api = `${host}/api/open/file/getNewMusicUrl.action`;
    } else
    if (type == "1") {
        api = img;
    } else
    if (type == "0") {
        api = {
            "wjgl": `${host}/api/open/batch/createBatchTask.action`,
            "zcbf": `${host}/api/portal/listFiles.action`
        };
    } else {
        api = `${host}/api/portal/getNewVlcVideoPlayUrl.action`;
    };

    let cok = fetch("hiker://files/rules/FYJK/ck/天翼.txt");

    let header = {
        "Accept": "application/json;charset=UTF-8",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cok
    };

    try {
        if (cok == "") {
            toast("登录天翼云盘");
            return dlu();
        } else
        if (type == "1") {
            return `pics://${api}`;
        } else
        if (type == "2") {
            //音频
            let mus = JSON.parse(fetchPC(buildUrl(api, {
                "fileId": fid,
                "shareId": sid,
                "dt": "1",
                "short": true,
                "forcedGet": "0"
            }), {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Cookie": cok
                }
            }));
            //log(mus)
            if (mus.errorCode == "InvalidSessionKey") {
                toast("切换网络后，需重新登录");
                return dlu();
            } else {
                let music = JSON.parse(fetchPC(mus.fileDownloadUrl, {
                    headers: {
                        "Referer": host
                    },
                    onlyHeaders: true
                }));
                //log(music)
                return music.url + "#isMusic=true#";
            };
        } else
        if (type == "0") {
            if (fetch("hiker://files/rules/FYJK/ck/天翼fid.txt") !== "") {
                //删除
                let schu = postPC(api.wjgl, {
                    headers: header,
                    body: {
                        "type": "DELETE",
                        "taskInfos": [{
                            "fileId": fetch("hiker://files/rules/FYJK/ck/天翼fid.txt"),
                            "fileName": fetch("hiker://files/rules/FYJK/ck/天翼fna.txt"),
                            "isFolder": 0
                        }],
                        "targetFolderId": ""
                    }
                });
                if (JSON.parse(schu).errorCode == "InvalidSessionKey") {
                    toast("切换网络后，需重新登录");
                    return dlu();
                };
                java.lang.Thread.sleep(1000);

                //清空回收站
                postPC(api.wjgl, {
                    headers: header,
                    body: {
                        "type": "EMPTY_RECYCLE",
                        "taskInfos": [],
                        "targetFolderId": ""
                    }
                });
            };

            //转存
            let data = JSON.parse(postPC(api.wjgl, {
                headers: header,
                body: {
                    "type": "SHARE_SAVE",
                    "taskInfos": [{
                        "fileId": fid,
                        "fileName": name,
                        "isFolder": "0"
                    }],
                    "targetFolderId": "-13",
                    "shareId": sid

                }
            })); //log(data);

            if (data.errorCode == "InvalidSessionKey") {
                toast("切换网络后，需重新登录");
                return dlu();
            };
            java.lang.Thread.sleep(1000);

            //转存播放
            let res = JSON.parse(fetchPC(buildUrl(api.zcbf, {
                "fileId": "-13"
            }), {
                headers: {
                    "Cookie": cok,
                    "Accept": "application/json;charset=UTF-8"
                }
            })).data;
            //log(res)

            if (res.length < 1) {
                return "toast://网盘容量不足，转存失败";
            } else {
                let dat;
                res.some((li) => {
                    if (name.trim() === li.fileName.trim()) {
                        writeFile("hiker://files/rules/FYJK/ck/天翼fid.txt", li.fileId);
                        dat = li.downloadUrl;
                        return true
                    }
                    return false;
                });
                writeFile("hiker://files/rules/FYJK/ck/天翼fna.txt", name);

                let audio = /\.(mp3|flac|ogg|m4a|wav|opus)$/i;
                let movie = /\.(mp4|mkv|avi|mov|rmvb|webm|flv|m4v|m3u8|ts)$/i;
                let pic = /\.(jpg|png|jpeg|gif|svg|raw)$/i;

                let dats = (is, dat, cok) => {
                    return JSON.stringify({
                        urls: [`https:${dat}${is}`],
                        headers: {
                            "Cookie": cok.replace(/;/g, "；；"),
                            "User-Agent": PC_UA.replace(/;/g, "；；")
                        }
                    });
                };

                if (audio.test(name)) {
                    return dats("#isMusic=true#", dat, cok);
                } else
                if (movie.test(name)) {
                    return dats("#isVideo=true#", dat, cok);
                } else
                if (pic.test(name)) {
                    return `https:${dat}#.jpg@User-Agent=${PC_UA}@Cookie=${cok}`
                } else {
                    return `download://https:${dat}@User-Agent=${PC_UA}@Cookie=${cok}`
                };
            };
        } else {
            //PC播放
            let down = JSON.parse(fetchPC(buildUrl(api, {
                "fileId": fid,
                "shareId": sid,
                "type": "4"
            }), {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Cookie": cok
                }
            }));
            //log(down)
            if (down.errorCode == "InvalidSessionKey") {
                toast("切换网络后，需重新登录");
                return dlu();
            } else {
                let play = JSON.parse(fetchPC(down.normal.url, {
                    headers: {
                        "Referer": host
                    },
                    onlyHeaders: true
                }));
                //log(play)
                return play.url + "#isVideo=true#";
            };
        };
    } catch (e) {
        log(toString(e));
        return "toast://播放失败";
    };
};

function size(size) {
    if (!size) {
        return '0';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    while (size >= 1024) {
        size /= 1024;
        i++;
    }
    size = i ? Number(size.toFixed(2)) : size;
    return `${size}\t${units[i]}`;
};

//样式
function tyyshi(d, tu) {
    let coll = tu == "移不动" ? "icon_3_fill" : "icon_2";
    d.push({
            col_type: "big_blank_block"
        }, {
            col_type: "big_blank_block"
        }, {
            col_type: "big_blank_block"
        }, {
            img: `hiker://files/cache/FY/image/${tu}云.png`,
            url: "hiker://empty",
            col_type: "pic_1_center"
        }, {
            col_type: "big_blank_block"
        }, {
            col_type: "big_blank_block"
        }, {
            col_type: "big_blank_block"
        }, {
            title: "样式",
            img: "hiker://files/cache/FY/image/分类排列.png",
            url: $(["text_1", "movie_2", "avatar", "card_pic_3_center"], 2).select(() => {
                setItem("fyyanshi", input);
                refreshPage(false);
                return "toast://已选择 " + input;
            }),
            col_type: coll
        },
        /*tu == "移动" ? {
               title: getItem("panqx", "zm") == "yh" ? "原画" : "转码",
               url: $("#noLoading#").lazyRule(() => {
                   if (getItem("panqx", "zm") == "yh") {
                       clearItem("panqx");
                   } else {
                       setItem("panqx", "yh");
                   }
                   refreshPage(false);
                   return "hiker://empty";
               }),
               img: "hiker://files/cache/FY/image/切换类型.png",
               col_type: coll
           } : "", */
        {
            title: getItem("zf", "f") == "z" ? "正序" : "倒序",
            url: $("#noLoading#").lazyRule(() => {
                if (getItem("zf", "f") == "z") {
                    clearItem("zf");
                } else {
                    setItem("zf", "z");
                }
                refreshPage(false);
                return "hiker://empty";
            }),
            img: "hiker://files/cache/FY/image/详情.png",
            col_type: coll
        }, {
            col_type: "big_blank_block"
        });
};
