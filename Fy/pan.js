addListener("onClose", $.toString(() => {
    clearMyVar("fydl");
    //clearVar("fyfwm");
    clearMyVar("fylist");
    clearMyVar("fyname");
    clearMyVar("fyfsl");
    clearMyVar("fyfcod");
    clearMyVar("fypanys");
}));

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
    if (li == "移动") {
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
                            let Input = prompt("输入云盘帐号");
                            if (/\d+/.test(Input)) {
                                fba.writeFile("hiker://files/rules/FYJK/ck/移动.txt", fba.getCookie("") + "###" + Input);
                            } else {
                                alert("帐号与cookie未保存");
                            };
                            fba.back();
                            fba.back();
                        }
                    }),
                    ua: MOBILE_UA,
                    canBack: true
                }
            })
            setResult(d);
        })
    } else
    if (li == "123") {
        return $("hiker://empty#noRecordHistory##noHistory##noLoading#").lazyRule(() => {
            const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));

            hikerPop.inputTwoRow({
                titleHint: "帐号",
                titleDefault: getItem("fy123zh", ""),
                urlHint: "密码",
                urlDefault: getItem("fy123mm", ""),
                noAutoSoft: false, //自动打开输入法
                title: "123云盘登录",
                //hideCancel: true,
                confirm(s1, s2) {
                    if (s1 == "" || s2 == "") return "toast://不能为空";

                    hikerPop.runOnNewThread(() => {
                        setItem("fy123zh", s1);
                        setItem("fy123mm", s2);
                        let gin = "https://login.123pan.com/api/user/sign_in";
                        let pos = JSON.parse(postPC(gin, {
                            body: {
                                "passport": getItem("fy123zh", s1),
                                "password": getItem("fy123mm", s2)
                            }
                        })); //log(pos)
                        if (pos.code == "200") {
                            let tok = pos.data.token;
                            writeFile("hiker://files/rules/FYJK/ck/123.txt", tok);
                            refreshPage(false);
                            return "toast://登录成功";
                        } else {
                            refreshPage(false);
                            return "toast://登录失败";
                        };
                    })
                },
                cancel() {
                    return "toast://取消";
                }
            })
            return "hiker://empty";
        });
    } else {
        return "toast://待开发"
    };
};

let ckdl = (li) => {
    let ckhs = (li, ck, uids, turl) => {
        return $("", li + ck).input((li, ck, uids, turl) => {
            if (!new RegExp(uids).test(input)) return `toast://输入正确的${ck}`;
            writeFile(turl, input);
            refreshPage(false);
            return `toast://已登录${li}盘`;
        }, li, ck, uids, turl);
    };

    if (/天翼/.test(li)) {
        return ckhs(li, "Cookie", "apm_uid=", `hiker://files/rules/FYJK/ck/${li}.txt`);
    } else
    if (/移动/.test(li)) {
        return ckhs(li, "Cookie", "authorization=", `hiker://files/rules/FYJK/ck/${li}.txt`);
    } else
    if (/123/.test(li)) {
        return ckhs(li, "Token", "-", `hiker://files/rules/FYJK/ck/${li}.txt`);
    } else
    if (/115/.test(li)) {
        return "toast://待开发";
    };

};

let fuz = (li) => {
    let coy = fetch("hiker://files/rules/FYJK/ck/" + li + ".txt");
    if (coy == "") return "toast://未登录";
    return "copy://" + coy;
};

let ex = (li) => {
    let ex = fetch("hiker://files/rules/FYJK/ck/" + li + ".txt");
    if (ex == "") return "toast://TK/CK不存在";
    return $("清除后不可恢复，确认清除" + li + " TK/CK？").confirm((li) => {
        if (li == "123") {
            clearItem("fy123zh");
            clearItem("fy123mm")
        };
        deleteFile("hiker://files/rules/FYJK/ck/" + li + ".txt");
        refreshPage(false);
        return "toast://清除成功";
    }, li)
};

function dlu() {
    let d = [];
    let txt = ["风影网盘", "调用网盘"];
    let tu = "hiker://images/";
    let pi = ["menu_rules2", "menu_new2"];
    txt.forEach((li, index) => {
        d.push({
            title: getMyVar("fydl", "风影网盘") == li ? '‘‘’’<b><span style="color:#19B89D">' + li + '</span></b>' : li,
            url: $("#noLoading#").lazyRule((li) => {
                putMyVar("fydl", li);
                refreshPage(false);
                return "hiker://empty";
            }, li),
            img: tu + pi[index],
            col_type: "icon_2"
        })
    });

    let tzdl = (li) => {
        if (/夸克|UC/.test(li)) {
            return "hiker://home@Quark.简";
        } else
        if (/百度/.test(li)) {
            return "hiker://home@百度云盘";
        } else
        if (/阿里/.test(li)) {
            return "hiker://home@云盘君.简";
        } else
        if (/迅雷/.test(li)) {
            return "hiker://page/diaoyong?rule=迅雷&page=fypage#";
        }
    };

    let she = getMyVar("fydl", "风影网盘");

    let pan = she == "风影网盘" ? ["天翼", "移动", "123", "115"] : ["百度", "阿里", "夸克", "UC", "迅雷"];
    let ima = "hiker://files/cache/FY/image/";

    pan.forEach((li) => {
        d.push({
            title: li + (/123|115|UC/.test(li) ? " 云盘" : "云盘"),
            desc: she == "风影网盘" ? (fetch("hiker://files/rules/FYJK/ck/" + li + ".txt") !== "" ? '<span style="color:#FA7298">已登录\t</span>' : "未登录\t") : "跳转登录",
            img: `${ima}${/115/.test(li) ? "云盘" : li}.png`,
            col_type: "avatar",
            url: she == "风影网盘" ? $(li == "123" ? ["帐号登录", "TK登录", "复制TK", "清除TK"] : ["网页登录", "CK登录", "复制CK", "清除CK"], 1, li).select((li) => {
                require(config.依赖.replace(/[^/]*$/, "pan.js"));
                if (/帐号|网页/.test(input)) {
                    return mmdl(li);
                } else
                if (/TK登录|CK登录/.test(input)) {
                    return ckdl(li)
                } else
                if (/复制TK|复制CK/.test(input)) {
                    return fuz(li)
                } else {
                    return ex(li)
                };
            }, li) : tzdl(li),
            extra: {
                inheritTitle: false
            }
        })
    })
    setResult(d);
};

function hs(myurl, d, list) {
    //log(list)
    if (list.length > 1 && Array.isArray(list) == true) {
        d.push({
            col_type: "big_blank_block"
        });
        list.forEach((li, index) => {
            let name = li.split("$")[0];
            let url = li.split("$")[3];
            let title = /cloud\.189/.test(url) ? `天翼 ${index + 1}` : /quark\.cn/.test(url) ? `夸克 ${index + 1}` : /pan\.baidu\.com/.test(url) ? `百度 ${index + 1}` : /uc\.cn/.test(url) ? `UC ${index + 1}` : /ali(pan|yun)/.test(url) ? `阿里 ${index + 1}` : /yun\.139/.test(url) ? `移动 ${index + 1}` : /xunlei/.test(url) ? `迅雷 ${index + 1}` : /magnet/.test(url) ? `磁力 ${index + 1}` : /(115cdn|anxia|115)\.com/.test(url) ? `115盘 ${index + 1}` : /www\.123[a-zA-Z\d]{3}\.com/.test(url) ? `123盘 ${index + 1}` : `其它 ${index + 1}`;

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
    let nam = getMyVar("fyname", Array.isArray(list) == true ? list[0].split("$")[0] : "云盘");

    let parts;
    if (url.includes("/t/")) {
        parts = url.split("/t/")[1];
    } else
    if (url.includes("code=")) {
        parts = url.split("code=")[1];
    } else
    if (url.includes("/m/")) {
        parts = url.split("/m/")[1];
    } else
    if (url.includes("/i/")) {
        parts = url.split("/i/")[1];
    } else 
    if (url.includes("/s/")) {
        parts = url.split("/s/")[1];
    } else {
        parts = url
    }; //log(parts)

    let host = getHome(url);
    let code = /yun\.139/.test(url) ? parts.replace("i?", "") : /www\.123[a-zA-Z\d]{3}\.com/.test(url) ? parts.replace(/([a-zA-Z\d-]+).*/, "$1") : parts.replace(/([a-zA-Z\d]+).*/, "$1"); //log(code)

    let fwm = "";
    if ((/提取码/.test(url) || /提取码/.test(nam)) && /www\.123[a-zA-Z\d]{3}\.com/.test(url)) {
        fwm = /提取码/.test(url) ? url.replace(/.*提取码[：:]\s*([a-zA-Z\d]{4}).*/, "$1") : nam.replace(/.*提取码[：:]\s*([a-zA-Z\d]{4}).*/, "$1");        
    } else
    if ((/提取码/.test(url) || /提取码/.test(nam)) && /yun\.139/.test(url)) {
        code = /提取码/.test(url) ? code : code + nam.replace(/.*(提取码[:：]\s*[a-zA-Z\d]{4}).*/, "$1");
    } else
    if ((/访问码|提取码/.test(url) || /提取码|访问码/.test(nam)) && getMyVar("fyfcod", "") == "" && /cloud\.189/.test(url)) {

        fwm = /访问码|提取码/.test(url) ? url.replace(/.*码[:：]\s*([a-zA-Z\d]{4}).*/, "$1") : nam.replace(/.*码[:：]\s*([a-zA-Z\d]{4}).*/, "$1");
        //log(fwm)        

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
    let fcod = getMyVar("fyfcod", ""); //log(fcod)

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
    //log(id)

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
        let fxlj = "hiker://page/fxlj?rule=百度云盘&realurl=";
        let login = "hiker://page/login?rule=百度云盘&realurl=";        
        return qtpan(d, nam, "百度", (fetch(fxlj) == "" ? login : fxlj) + url);
    } else
    if (/uc\.cn/.test(url)) {
        return qtpan(d, nam, "UC", "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(url) + "&sharePwd=");
    } else
    if (/ali(pan|yun)/.test(url)) {
        return qtpan(d, nam, "阿里", "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(url));
    } else
    if (/yun\.139/.test(url)) {
        require(config.依赖.replace(/[^/]*$/, "Yun.js"));
        if (getMyVar("fypanys", "0") == "1") {
            tyyshi(d, "移动");
        };
        return ydlists(myurl, d, size, code, "root");
    } else
    if (/magnet:|\.torrent|ed2k:|pan\.xunlei/.test(url)) {
        return qtpan(d, nam, /magnet:|\.torrent|ed2k:/.test(url) ? "磁力" : "迅雷", "hiker://page/diaoyong?rule=迅雷&page=fypage#" + url);
    } else
    if (/www\.123[a-zA-Z\d]{3}\.com/.test(url)) {
        require(config.依赖.replace(/[^/]*$/, "Yun.js"));
        if (getMyVar("fypanys", "0") == "1") {
            tyyshi(d, "123");
        };
        return lists123(myurl, host, d, size, code, "0", "0", "1", fwm);
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
            tyyshi(d, "天翼");
        };
        return lists(myurl, host, id.fileId, id.shareId || fcod, id.isFolder, id.shareMode, d, size, fwm);
    };
};
