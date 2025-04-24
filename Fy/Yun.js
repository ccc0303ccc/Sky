function lists(host, fid, sid, fol, d, size) {
    //获取列表请求
    let list = JSON.parse(fetch(buildUrl(host + "/api/open/share/listShareDir.action", {
        "pageNum": 1,
        "pageSize": 9999,
        "fileId": fid,
        "isFolder": fol,
        "shareId": sid,
        "shareMode": getMyVar("fyfwm", "") == "" ? 3 : 1,
        "iconOption": 5,
        "orderBy": "lastOpTime",
        "descending": true,
        "accessCode": getMyVar("fyfwm", "")
    }), {
        headers: {
            "Accept": "application/json;charset=UTF-8",
            "Referer": host
        }
    }).replace(/\"id\":(\d+)/g, '"id":"$1"'));
    //log(list)       

    let folis = list.fileListAO.folderList.sort((a, b) => a.name.localeCompare(b.name)); //log(folis)

    let listt = list.fileListAO.fileList.sort((a, b) => a.name.localeCompare(b.name)); //log(listt)

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
            title: `<small>${li.name}</small>`,
            desc: `<small>${li.lastOpTime}</small>`,
            img: "hiker://images/icon_folder3",
            url: $("hiker://empty#noHistory#").rule((host, fid, sid, fol) => {
                let d = [];
                require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                tyyshi(d);

                try {
                    lists(host, fid, sid, fol, d, size);
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
            }, host, li.id, sid, fol),
            col_type: "avatar"
        })
    });

    let col = getItem("fyyanshi", "avatar");
    let cotxt = (col, txt) => {
        return /movie/.test(col) ? txt.replace(/\d{2}:\d{2}:\d{2}/, "") : /avatar/.test(col) ? `<small>${txt.replace(/\d{2}:\d{2}:\d{2}/, "")}</small>` : `‘‘’’<small>${txt}</small>`;
    };

    //列表
    zfli.forEach((li) => {
        let type = li.mediaType;
        if (/0|1|2|3/.test(type)) {
            let img = type == "2" ? "hiker://images/icon_music3" : type == "0" ? "hiker://images/icon_video2" : li.icon.largeUrl;
            d.push({
                title: cotxt(col, li.name),
                img: img,
                desc: `${cotxt(col, li.lastOpTime)}\t${cotxt(col, size(li.size))}`,
                url: $("hiker://empty").lazyRule((host, fid, sid, img, name, type) => {
                    require(config.依赖.replace(/[^/]*$/, "Yun.js"));
                    return tylazy(host, fid, sid, img, name, type);
                }, host, li.id, sid, img, li.name, type),
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
                return JSON.stringify({
                    urls: ["https:" + dat + "#isVideo=true#"],
                    headers: {
                        "Cookie": cok.replace(/;/g, "；；"),
                        "User-Agent": PC_UA.replace(/;/g, "；；")
                    }
                });
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

//天翼样式
function tyyshi(d) {
    d.push({
        col_type: "big_blank_block"
    }, {
        col_type: "big_blank_block"
    }, {
        col_type: "big_blank_block"
    }, {
        img: "hiker://files/cache/FY/image/天翼云.png",
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
        col_type: "icon_2"
    }, {
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
        col_type: "icon_2"
    }, {
        col_type: "big_blank_block"
    });
};
