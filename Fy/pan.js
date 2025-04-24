addListener("onClose", $.toString(() => {
    clearMyVar("fydl");
    clearMyVar("fyfwm");
    clearMyVar("fylist");
    clearMyVar("fyname");
    clearMyVar("fyfsl");
    clearMyVar("fyfcod");
    clearMyVar("fypanys");
}));

function dlu() {
    let d = [];
    let txt = ["密码登录", "CK登录", "复制CK", "清除CK"];
    let tu = "hiker://images/";
    let pi = ["menu_new2", "menu_now2", "menu_backup2", "menu_clear2"];
    txt.forEach((li, index) => {
        d.push({
            title: getMyVar("fydl", "密码登录") == li ? '‘‘’’<b><span style="color:#19B89D">' + li + '</span></b>' : li,
            url: $("#noLoading#").lazyRule((li) => {
                putMyVar("fydl", li);
                refreshPage(false);
                return "hiker://empty";
            }, li),
            img: tu + pi[index],
            col_type: "icon_small_4"
        })
    });

    let mmdl = (li) => {
        if (li == "天翼") {
            return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
                let d = [];
                d.push({
                    url: "https://cloud.189.cn/api/portal/loginUrl.action?redirectURL=https://cloud.189.cn/web/redirect.html&defaultSaveName=3&defaultSaveNameCheck=uncheck",
                    col_type: "x5_webview_single",
                    desc: "100%&&float",
                    extra: {
                        js: $.toString(() => {
                            var url = location.href
                            fba.log(url)
                            if (url.includes("https://cloud.189.cn/web/main")) {
                                fba.writeFile("hiker://files/rules/FYJK/ck/天翼.txt", fba.getCookie(""))
                                alert("已获取到cookie，返回即可")
                                fba.back()
                            }
                        }),
                        ua: PC_UA,
                        canBack: true
                    }
                })
                setResult(d);
            });
        } else
        if (li == "移不动") {
            return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
                let d = [];
                d.push({
                    url: "https://yun.139.com/m/#/login",
                    col_type: "x5_webview_single",
                    desc: "100%&&float",
                    extra: {
                        js: $.toString(() => {
                            var url = location.href
                            fba.log(url)
                            if (url.includes("https://yun.139.com/m/#/main")) {
                                fba.writeFile("hiker://files/rules/FYJK/ck/移动.txt", fba.getCookie(""))
                                alert("已获取到cookie，返回即可")
                                fba.back()
                            }
                        }),
                        ua: MOBILE_UA,
                        canBack: true
                    }
                })
                setResult(d);
            })
        } else {
            return "toast://待开发";
        };
    };

    let ckdl = (li) => {
        return $("", li + " token或cookie").input((li) => {
            if (!/_uid=/.test(input)) return "toast://输入正确的token或cookie";
            writeFile("hiker://files/rules/FYJK/ck/" + li + ".txt", input);
            refreshPage(false);
            return "toast://已登录" + li + "盘";
        }, li);
    };

    let fuz = (li) => {
        let coy = fetch("hiker://files/rules/FYJK/ck/" + li + ".txt");
        if (coy == "") return "toast://未登录";
        return "copy://" + coy;
    };

    let ex = (li) => {
        let ex = fetch("hiker://files/rules/FYJK/ck/" + li + ".txt");
        if (ex == "") return "toast://CK不存在";
        return $("清除后不可恢复，确认清除" + li + " CK？").confirm((li) => {
            refreshPage(false);
            deleteFile("hiker://files/rules/FYJK/ck/" + li + ".txt");
            return "toast://清除成功";
        }, li)
    };

    let she = getMyVar("fydl", "密码登录");

    let pan = ["天翼", "移动", "百度", "阿里", "夸克", "UC", "123", "115"];
    let ima = "hiker://files/cache/FY/image/";

    pan.forEach((li) => {
        d.push({
            title: li + (/123|115|UC/.test(li) ? " 云盘" : "云盘"),
            desc: fetch("hiker://files/rules/FYJK/ck/" + li + ".txt") !== "" ? '<span style="color:#FA7298">已登录\t</span>' : "未登录\t",
            img: `${ima}${/115/.test(li) ? "云盘" : li}.png`,
            col_type: "avatar",
            url: she == "CK登录" ? ckdl(li) : she == "密码登录" ? mmdl(li) : she == "复制CK" ? fuz(li) : ex(li),
            extra: {
                inheritTitle: false
            }
        })
    })
    setResult(d);
};

function hs(d, list) {
    //log(list)
    if (list.length > 1 && Array.isArray(list) == true) {
        d.push({
            col_type: "big_blank_block"
        });
        list.forEach((li, index) => {
            let name = li.split("$")[0];
            let url = li.split("$")[3];
            let title = /cloud\.189/.test(url) ? `天翼 ${index + 1}` : /quark\.cn/.test(url) ? `夸克 ${index + 1}` : /pan\.baidu\.com/.test(url) ? `百度 ${index + 1}` : /uc\.cn/.test(url) ? `UC ${index + 1}` : /ali(pan|yun)/.test(url) ? `阿里 ${index + 1}` : /yun\.139/.test(url) ? `移动 ${index + 1}` : /xunlei/.test(url) ? `迅雷 ${index + 1}` : /magnet/.test(url) ? `磁力 ${index + 1}` : /(115cdn|anxia|115)\.com/.test(url) ? `115盘 ${index + 1}` : /www\.123[0-9a-zA-Z]{3}\.com/.test(url) ? `123盘 ${index + 1}` : `其它 ${index + 1}`;

            d.push({
                title: getMyVar("fylist", list[0].split("$")[3]) == url ? `‘‘’’<small><b><font color="#33cccc">${title}</font></b></small>` : `‘‘’’<small>${title}</small>`,
                url: $("#noLoading#").lazyRule((url, name) => {
                    clearMyVar("fyfwm");
                    clearMyVar("fyfcod");
                    clearMyVar("fyfsl");
                    putMyVar("fylist", url);
                    putMyVar("fyname", name);
                    refreshPage(false);
                    return "hiker://empty";
                }, url, name),
                col_type: "scroll_button"
            })
        });
    };

    let url = getMyVar("fylist", Array.isArray(list) == true ? list[0].split("$")[3] : list); //log(url)
    let nam = getMyVar("fyname", Array.isArray(list) == true ? list[0].split("$")[0] : "天翼");

    let parts;
    if (url.includes("/t/")) {
        parts = url.split("/t/")[1];
    } else
    if (url.includes("code=")) {
        parts = url.split("code=")[1];
    } else {
        parts = url
    }

    let host = getHome(url);
    let code = parts.replace(/(.*?)\（.*/, "$1"); //log(code)

    if ((/访问码/.test(url) || /提取码|访问码/.test(nam)) && getMyVar("fyfcod", "") == "" && /cloud\.189/.test(url)) {
        let fwm = /访问码|提取码/.test(url) ? url.replace(/.*码：([a-zA-Z\d]+)\）.*/, "$1") : nam.replace(/.*提取码：([a-zA-Z\d]+) .*/, "$1");
        //log(fwm)
        putMyVar("fyfwm", fwm);

        var fwcod = JSON.parse(fetchPC(buildUrl(host + "/api/open/share/checkAccessCode.action", {
            "shareCode": code,
            "accessCode": fwm,
            //"uuid": "cc1eb706-78d9-84b1-6864-60558b74afed"
        }), {
            headers: {
                "Accept": "application/json;charset=UTF-8"
            }
        }).replace(/\"shareId\":(\d+)/g, '"shareId":"$1"')).shareId;
        //log(fcod)
        putMyVar("fyfcod", fwcod);
    };
    let fcod = getMyVar("fyfcod", "");

    //获取fid
    if (getMyVar("fyfsl", "") == "" && /cloud\.189/.test(url)) {
        let id = JSON.parse(fetchPC(buildUrl(host + "/api/open/share/getShareInfoByCodeV2.action", {
            "shareCode": code
        }), {
            headers: {
                "Accept": "application/json;charset=UTF-8"
            }
        }).replace(/\"shareId\":(\d+)/g, '"shareId":"$1"'));
        //log(id)
        storage0.putMyVar("fyfsl", id);
    };
    let id = storage0.getMyVar("fyfsl", "");
    //log(json)

    let qtpan = (d, tit, img, url) => {
        d.push({
            title: tit,
            desc: `<small>${img}盘\t</small>`,
            img: `hiker://files/cache/FY/image/${img}.png`,
            url: url,
            col_type: "avatar"
        })
    };

    if (/quark\.cn/.test(url)) {
        return qtpan(d, nam, "夸克", "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(url) + "&sharePwd=");
    } else
    if (/pan\.baidu\.com/.test(url)) {
        let lis = "hiker://page/list?rule=百度网盘&realurl=";
        let lif = fetch(lis);
        let loi = "hiker://page/loging?rule=百度网盘&realurl=";
        return qtpan(d, nam, "百度", (lif !== "" ? lis : loi) + url);
    } else
    if (/uc\.cn/.test(url)) {
        return qtpan(d, nam, "UC", "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(url) + "&sharePwd=");
    } else
    if (/ali(pan|yun)/.test(url)) {
        return qtpan(d, nam, "阿里", "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(url));
    } else
    if (/yun\.139/.test(url)) {
        return qtpan(d, nam, "移动", url);
    } else
    if (/magnet/.test(url)) {
        return qtpan(d, nam, "磁力", url);
    } else
    if (/xunlei/.test(url)) {
        return qtpan(d, nam, "迅雷", url);
    } else
    if (/www\.123[0-9a-zA-Z]{3}\.com/.test(url)) {
        return qtpan(d, nam, "123", url);
    } else
    if (/(115cdn|anxia)\.com/.test(url)) {
        return qtpan(d, nam, "云盘", url);
    } else
    if (!/cloud\.189/.test(url)) {
        return qtpan(d, nam, "云盘", url);
    } else
    if (id.res_code == "ShareNotFound") {
        d.push({
            desc: "分享已取消",
            col_type: "text_center_1",
            url: "hiker://empty",
            extra: {
                lineVisible: false
            }
        }, {
            col_type: "big_blank_block"
        })
    } else
    if (id.res_code == "ShareAuditNotPass") {
        d.push({
            desc: "分享被和谐",
            col_type: "text_center_1",
            url: "hiker://empty",
            extra: {
                lineVisible: false
            }
        }, {
            col_type: "big_blank_block"
        })
    } else {
        require(config.依赖.replace(/[^/]*$/, "Yun.js"));
        if (getMyVar("fypanys", "0") == "1") {
            tyyshi(d);
        };
        return lists(host, id.fileId, id.shareId || fcod, id.isFolder, d, size);
    };
};
