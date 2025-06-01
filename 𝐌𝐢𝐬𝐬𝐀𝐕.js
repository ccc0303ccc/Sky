const Sky = {
    version: "20250509",
    empty: 'hiker://empty',
    url: "https://missav.live/dm45/",
    d: [],
    taskList: [],
    getRangeColors: function() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0)
                .toString(16))
            .substr(-6);
    }, //隨機顏色
    pageAdd: function(page) {
        if (getMyVar("page")) {
            putMyVar("page", (parseInt(page) + 1) + '');
        }
        return;
    }, //翻頁
    pageMoveto: function(page, pages) {
        var longClick = [{
            title: "首頁",
            js: $.toString(() => {
                putMyVar("page", "1");
                refreshPage();
                return "hiker://empty";
            }),
        }, {
            title: "上頁",
            js: $.toString((page) => {
                if (page > 1) {
                    putMyVar("page", (parseInt(page) - 1));
                    refreshPage();
                    return "hiker://empty";
                }
            }, page),
        }, {
            title: "第" + page + "頁",
            js: "",
        }, {
            title: "跳轉",
            js: $.toString(() => {
                return $("").input(() => {
                    putMyVar("page", input);
                    refreshPage();
                });
            }),
        }];
        if (typeof(pages) != 'undefined') {
            var extra1 = {
                title: "尾頁" + pages,
                js: $.toString((pages) => {
                    putMyVar("page", pages);
                    refreshPage();
                    return "hiker://empty";
                }, pages),
            };
            longClick.push(extra1)
        }
        return longClick
    }, //長按跳頁
    data: {
        category: getMyVar('MissAV.category', '0'),
        subCate: getMyVar('MissAV.subCate', '0'),
    },
    baseParse: () => {
        putMyVar("MY_TYPE", "主頁");
        var page = getMyVar("page", MY_PAGE + "")
        let categoryList = [{
            title: '推薦',
            path: '',
            type: 'video',
            sub: [{
                title: '最近更新',
                path: 'new',
            }, {
                title: '新作上市',
                path: 'release',
            }, {
                title: '今日熱門',
                path: 'today-hot',
            }, {
                title: '本週熱門',
                path: 'weekly-hot',
            }, {
                title: '本月熱門',
                path: 'monthly-hot',
            }]
        }, {
            title: '中字',
            path: 'chinese-subtitle',
            type: 'video',
            sub: []
        }, {
            title: '無碼',
            path: '',
            type: 'video',
            sub: [{
                title: '流出',
                path: 'uncensored-leak'
            }, {
                title: 'FC2',
                path: 'fc2'
            }, {
                title: 'HEYZO ',
                path: 'heyzo'
            }, {
                title: '東京熱',
                path: 'tokyohot'
            }, {
                title: '一本道',
                path: '1pondo'
            }, {
                title: 'Caribbeancom',
                path: 'caribbeancom'
            }, {
                title: 'Caribbeancompr',
                path: 'caribbeancompr'
            }, {
                title: '10musume',
                path: '10musume'
            }, {
                title: 'pacopacomama',
                path: 'pacopacomama'
            }, {
                title: 'Gachinco',
                path: 'gachinco'
            }, {
                title: 'XXX-AV',
                path: 'xxxav'
            }, {
                title: '人妻斩',
                path: 'marriedslash'
            }, {
                title: '頑皮 4610',
                path: 'naughty4610'
            }, {
                title: '頑皮 0930',
                path: 'naughty0930'
            }, ]
        }, {
            title: '素人',
            path: '',
            type: 'video',
            sub: [{
                    title: 'SIRO',
                    path: 'siro'
                },
                {
                    title: 'LUXU',
                    path: 'luxu'
                },
                {
                    title: 'GANA',
                    path: 'gana'
                },
                {
                    title: 'PRESTIGE PREMIUM',
                    path: 'maan'
                },
                {
                    title: 'S-CUTE',
                    path: 'scute'
                },
                {
                    title: 'ARA',
                    path: 'ara'
                },
            ]
        }, {
            title: '國產',
            path: '',
            type: 'video',
            sub: [{
                title: '麻豆傳媒',
                path: 'madou'
            }, {
                title: 'TWAV',
                path: 'twav'
            }, {
                title: 'Furuke',
                path: 'furuke'
            }, ]
        }, {
            title: 'VR',
            path: 'genres/VR',
            type: 'video',
            sub: []
        }, {
            title: 'AV影評',
            path: 'articles',
            type: 'articles',
            sub: []
        }, {
            title: '女優一覽',
            path: 'actresses',
            type: 'avatar',
            sub: []
        }, {
            title: '女優排行',
            path: 'actresses/ranking',
            type: 'avatar',
            sub: []
        }, {
            title: '類型',
            path: 'genres',
            type: 'tags',
            sub: []
        }, {
            title: '發行商',
            path: 'makers',
            type: 'tags',
            sub: []
        }, {
            title: '更多',
            path: '',
            type: 'video',
            sub: [{
                title: '123AV',
                path: 'site/123av',
            }, {
                title: 'Njav',
                path: 'site/njav',
            }, {
                title: 'Supjav',
                path: 'site/supjav',
            }, ]
        }, ]
        const currentCate = categoryList[Sky.data.category]
        let url
        var type = currentCate.type
        var path = currentCate.path
        if (currentCate.sub.length > 0) {
            url = getMyVar("url", Sky.url + currentCate.sub[Sky.data.subCate].path)
        } else {
            url = getMyVar("url", Sky.url + currentCate.path)
        }
        url = url.replace(/(\?page=\d+|\&page=\d+|$)/, (match) => {
            if (match.startsWith('?') || match.startsWith('&')) {
                return match.charAt(0) + 'page=' + page;
            } else {
                if (page == 1) {
                    return ""
                }
                return (url.includes('?') ? '&page=' : '?page=') + page;
            }
        });
        Sky.pageAdd(page)
        if (url.includes("search")) {
            type = "search"
        }
        log(url)
        if (MY_PAGE == 1) {
            categoryList.forEach((cate, index) => {
                Sky.d.push({
                    title: parseInt(Sky.data.category) === index ?
                        '‘‘’’' + cate.title.fontcolor("#FFFFFF") : cate.title,
                    url: $(Sky.empty + "#noLoading#").lazyRule((index) => {
                        putMyVar("MissAV.category", index.toString())
                        putMyVar("MissAV.subCate", '0')
                        clearMyVar("url")
                        clearMyVar("page")
                        refreshPage(true)
                        return "hiker://empty"
                    }, index),
                    extra: {
                        'backgroundColor': parseInt(Sky.data.category) === index ? Sky.getRangeColors() : ''
                    },
                    col_type: 'scroll_button',
                })
            })
            if (currentCate.sub.length > 0) {
                Sky.d.push({
                    col_type: 'blank_block',
                })
                currentCate.sub.forEach((cate, index) => {
                    Sky.d.push({
                        title: parseInt(Sky.data.subCate) === index ?
                            '‘‘’’' + cate.title.fontcolor("#FFFFFF") : cate.title,
                        url: $(Sky.empty + "#noLoading#").lazyRule((index) => {
                            putMyVar("MissAV.subCate", index.toString());
                            clearMyVar("url")
                            clearMyVar("page")
                            refreshPage(true)
                            return "hiker://empty"
                        }, index),
                        extra: {
                            'backgroundColor': parseInt(Sky.data.subCate) === index ? Sky.getRangeColors() : ''
                        },
                        col_type: 'scroll_button',
                    })
                })
            }
        }
        const html = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        });
        //動態分類
        Sky.DynamicSort(html)
        Sky.ActorSort(url, html)
        //搜索
        if (page == 1) {
            Sky.d.push({
                title: "搜索",
                url: $.toString((url) => {
                    if (input.trim() != "") {
                        putMyVar('keyword', input);
                        var searchUrl = getHome(url) + "/search/" + input
                        putMyVar("url", searchUrl);
                        refreshPage();
                        return "hiker://empty"
                    } else {
                        return "confirm://搜索内容為空.js:'hiker://empty'"
                    }
                }, url),
                desc: '使用 + 號來結合多個關鍵字',
                col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', '') || "",
                }
            });
        }

        switch (type) {
            case 'video':
                Sky.videoType(html, page)
                break
            case 'articles':
                Sky.articlesType(html, page)
                break
            case 'avatar':
                if ((path === 'actresses/ranking' && page == 1) || path !== 'actresses/ranking') {
                    Sky.avatarType(html, page)
                }
                break
            case 'tags':
                Sky.tagsType(html, page)
                break
            case 'search':
                if (MY_PAGE == 1) {
                    Sky.d.push({
                        title: '““””' + "搜索結果".fontcolor("#FFBF00"),
                        url: "hiker://empty",
                        col_type: "text_1",
                        extra: {
                            lineVisible: false
                        }
                    })
                    try {
                        Sky.avatarType(html, page)
                    } catch {}
                    Sky.d.push({
                        col_type: "blank_block"
                    })
                    try {
                        Sky.videoType(html, page)
                    } catch {}
                } else {
                    try {
                        Sky.videoType(html, page)
                    } catch {}
                }
                break
            default:
                Sky.videoType(html, page)
        }
        setResult(Sky.d)
    },

    //動態分類
    DynamicSort: (html) => {
        const 分類顏色 = Sky.getRangeColors()
        const 大類定位 = ".mb-6:has(.relative)&&.relative"
        const 拼接分類 = ".mb-3&&.relative"
        const 小類定位 = "body&&.block"
        const 分類標題 = "Text"
        const 分類連結 = "a&&href"
        try {
            if (typeof(拼接分類) != 'undefined' && 拼接分類 != '') {
                var categories = pdfa(html, 大類定位).concat(pdfa(html, 拼接分類))
            } else {
                var categories = pdfa(html, 大類定位)
            }
        } catch {
            var categories = pdfa(html, 大類定位)
        }
        let init_cate = []
        for (let i = 0; i < 20; i++) {
            init_cate.push("0")
        }
        if (getMyVar("MY_TYPE") == "主頁") {
            var cate_temp_json = getMyVar("sort", JSON.stringify(init_cate))
        } else {
            var cate_temp_json = getMyVar("ysort", JSON.stringify(init_cate))
        }
        var cate_temp = JSON.parse(cate_temp_json)

        if (MY_PAGE == 1) {
            Sky.d.push({
                col_type: "blank_block"
            });
            categories.forEach((category, index) => {
                let sub_categories = pdfa(category, 小類定位);
                sub_categories.forEach((item, key) => {
                    let title = pdfh(item, 分類標題)
                    if (typeof(排除) != 'undefined' && 排除 != '') {
                        title = title.replace(new RegExp(排除, "g"), "")
                    };
                    Sky.d.push({
                        title: key.toString() === cate_temp[index] ? '““””' + title.fontcolor("#FFFFFF") : title,
                        url: $(pdfh(item, 分類連結) + '#noLoading#').lazyRule((params) => {
                            params.cate_temp[params.index] = params.key.toString()
                            if (getMyVar("MY_TYPE") == "主頁") {
                                putMyVar('sort', JSON.stringify(params.cate_temp));
                                putMyVar("url", input);
                            } else {
                                putMyVar('ysort', JSON.stringify(params.cate_temp));
                                putMyVar("yurl", input);
                            }
                            clearMyVar("page")
                            refreshPage(true)
                            return "hiker://empty"
                        }, {
                            cate_temp: cate_temp,
                            index: index,
                            key: key,
                            page: MY_PAGE,
                        }),
                        col_type: 'scroll_button',
                        extra: {
                            'backgroundColor': key.toString() === cate_temp[index] ? Sky.getRangeColors() : ''
                        }
                    })
                })
                Sky.d.push({
                    col_type: "blank_block"
                });
            })
        }
    },
    //女優sort
    ActorSort: (url, html) => {
        const 分類顏色 = Sky.getRangeColors()
        const 大類定位 = "body&&.grid.mb-3&&select"
        const 拼接分類 = ""
        const 小類定位 = "body&&option"
        const 分類標題 = "Text"
        const 分類連結 = "option&&value"
        try {
            if (typeof(拼接分類) != 'undefined' && 拼接分類 != '') {
                var categories = pdfa(html, 大類定位).concat(pdfa(html, 拼接分類))
            } else {
                var categories = pdfa(html, 大類定位)
            }
        } catch {
            var categories = pdfa(html, 大類定位)
        }
        let init_cate = []
        for (let i = 0; i < 20; i++) {
            init_cate.push("0")
        }
        var cate_temp_json = getMyVar("asort", JSON.stringify(init_cate))
        var cate_temp = JSON.parse(cate_temp_json)

        if (MY_PAGE == 1) {
            Sky.d.push({
                col_type: "blank_block"
            });
            categories.forEach((category, index) => {
                let sub_categories = pdfa(category, 小類定位);
                sub_categories.forEach((item, key) => {
                    let title = pdfh(item, 分類標題)
                    if (typeof(排除) != 'undefined' && 排除 != '') {
                        title = title.replace(new RegExp(排除, "g"), "")
                    };
                    Sky.d.push({
                        title: key.toString() === cate_temp[index] ? '““””' + title.fontcolor("#FFFFFF") : title,
                        url: $(pdfh(item, 分類連結) + '#noLoading#').lazyRule((url, params) => {
                            params.cate_temp[params.index] = params.key.toString()
                            if (params.index == 0) {
                                input = input ? ("&height=" + input) : ""
                                url = url.replace(/\&height=.*(\&.*)?/, "$1") + input
                            }
                            if (params.index == 1) {
                                input = input ? ("&cup=" + input) : ""
                                url = url.replace(/\&cup=.*(\&.*)?/, "$1") + input
                            }
                            if (params.index == 2) {
                                input = input ? ("&age=" + input) : ""
                                url = url.replace(/\&age=.*(\&.*)?/, "$1") + input
                            }
                            if (params.index == 3) {
                                input = input ? ("&debut=" + input) : ""
                                url = url.replace(/\&debut=.*(\&.*)?/, "$1") + input
                            }
                            putMyVar('asort', JSON.stringify(params.cate_temp));
                            putMyVar("url", url);
                            clearMyVar("page")
                            refreshPage(true)
                            return "hiker://empty"
                        }, url, {
                            cate_temp: cate_temp,
                            index: index,
                            key: key,
                            page: MY_PAGE,
                        }),
                        col_type: 'scroll_button',
                        extra: {
                            'backgroundColor': key.toString() === cate_temp[index] ? Sky.getRangeColors() : ''
                        }
                    })
                })
                Sky.d.push({
                    col_type: "blank_block"
                });
            })
        }
    },
    //搜索
    searchParse: () => {
        log(MY_URL)
        if (MY_PAGE == 1) {
            Sky.d.push({
                title: "——女優——",
                url: "hiker://empty"
            });
            try {
                Sky.avatarType(getResCode());
            } catch {}
            Sky.d.push({
                title: "——影片——",
                url: "hiker://empty"
            });
            try {
                Sky.videoType(getResCode());
            } catch {}
        } else {
            try {
                Sky.videoType(getResCode());
            } catch {}
        }
        setResult(Sky.d)
    },

    //二級
    videoParse: (url) => {
        var html = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        });
        Sky.d.push({
            img: 'https://s2.loli.net/2025/05/07/jEhr9ifg3NVowdq.png',
            url: 'hiker://empty',
            col_type: 'pic_1_full',
        })
        const title = pdfh(html, 'h1&&Text')
        //log(url)
        //setPageTitle(title)
        
        Sky.d.push({
            desc: pdfh(html, '.text-secondary.break-all.line-clamp-2&&Text'),
            pic_url: pdfh(html, 'meta[property=og:image]&&content') + '@Referer=' + Sky.url,
            url: $(Sky.empty + '#noHistory#').lazyRule((html, url) => {
                eval(html.match(/eval.*?source.*\n/)[0])
                // 獲取畫質列表，併去最高畫質
                let group_quality = fetch(source, {
                    headers: {
                        "origin": getHome(url)
                    }
                })
                hghest_quality = group_quality.match(/^(.*)\.m3u8$/gm).map(v => source.replace("playlist.m3u8", v))
                name_quality = group_quality.match(/RESOLUTION=.*$/gm).map(n => n.replace("RESOLUTION=", ""))
                // 按分辨率降序排序 分辨率 數組，併同時调整 hghest_quality
                var sortedData = name_quality.map((name, index) => ({
                    name,
                    url: hghest_quality[index]
                })).sort((a, b) => b.name.match(/(\d+)/)[1] - a.name.match(/(\d+)/)[1]);
                // 分開排序後的 names 和 urls 數組
                var sortedNames = sortedData.map(item => item.name);
                var sortedUrls = sortedData.map(item => item.url);
                let playlist = JSON.stringify({
                    names: sortedNames,
                    urls: sortedUrls,
                    headers: new Array(hghest_quality.length).fill({
                        Referer: getHome(url) + "/"
                    })
                });
                return playlist;
            }, html, Sky.url),
            col_type: 'pic_1_full',
        })
        Sky.d.push({
            title: '““””' + title.fontcolor("#6A5ACD").bold(),
            url: url + "#noHistory#",
            col_type: 'text_1',
            extra: {
                lineVisiable: false
            }
        })
        var content = pdfh(html, '.text-secondary.break-all.line-clamp-2&&Text');
        if (content.trim() != "") {
            Sky.setDesc(content)
        }

        const text_secondary_list = pdfa(html, 'body&&.text-secondary')
        let num, actressesList, tagsList, series, makers, directors, labelsList
        text_secondary_list.forEach(item => {
            let current_title = pdfh(item, 'span&&Text')
            let actressName = '女優'
            if (current_title === '番號:') {
                num = pdfh(item, '.font-medium&&Text').replace("-UNCENSORED-LEAK", "").replace("-CHINESE-SUBTITLE", "")
            } else if (current_title === actressName + ':') {
                actressesList = pdfa(item, '.text-secondary&&a')
            } else if (current_title === '類型:') {
                tagsList = pdfa(item, '.text-secondary&&a')
            } else if (current_title === '系列:') {
                series = pdfa(item, '.text-secondary&&a')[0]
            } else if (current_title === '發行商:') {
                makers = pdfa(item, '.text-secondary&&a')[0]
            } else if (current_title === '導演:') {
                directors = pdfa(item, '.text-secondary&&a')[0]
            } else if (current_title === '標籤:') {
                labelsList = pdfa(item, '.text-secondary&&a')
            }
        })
        var 日期 = pdfh(html, 'body&&.text-secondary:matches(發行日期:)&&Text');
        if (日期.trim() != "") {
            Sky.d.push({
                title: "““””📆 " + 日期.fontcolor("FF8C00"),
                url: "hiker://search?rule=𝐉𝐚𝐯𝐃𝐁&s=" + num,
                col_type: 'text_1',
                extra: {
                    lineVisiable: false
                }
            })
        }
        if (num) {
            Sky.d.push({
                title: "““””番號 : " + num.fontcolor("#FA7298"),
                url: 'copy://' + num,
                col_type: 'text_1',
                extra: {
                    lineVisible: false
                },
            })
        }
        var 標題 = pdfh(html, 'body&&.text-secondary:matches(標題)&&Text');
        if (標題.trim() != "") {
            Sky.d.push({
                title: 標題.fontcolor("#FF8C00").small(),
                url: 'hiker://empty',
                col_type: 'rich_text',
                extra: {
                    lineVisiable: false
                }
            })
        }
        Sky.d.push({
            col_type: 'line_blank'
        })
        if (actressesList) {
            actressesList.forEach((actresses, index) => {
                let title = pdfh(actresses, 'a&&Text')
                let url = pdfh(actresses, 'a&&href')
                Sky.taskList.push({
                    func: Sky.updateAvatar,
                    param: {
                        url: url,
                        index: 'avatar_' + index
                    },
                    id: 'avatar_' + index,
                })
                Sky.d.push({
                    title: "““””" + title.fontcolor("#1E90FF").small(),
                    desc: '演員',
                    pic_url: Sky.empty ? Sky.empty : 'https://missav.live/img/favicon.ico',
                    url: $(url + '?page=fypage#noHistory##immersiveTheme#').rule((title) => {
                        const Sky = $.require('hiker://page/Sky')
                        setPageTitle(title)
                        Sky.yijiParse(MY_URL)
                        setResult(Sky.d)
                    }, title),
                    col_type: 'icon_4_card',
                    extra: {
                        id: 'avatar_' + index,
                    }
                })
            })
            Sky.d.push({
                col_type: 'line_blank'
            })
        }
        if (tagsList) {
            Sky.d.push({
                title: '類型 : ',
                url: Sky.empty,
                col_type: 'flex_button',
                extra: {
                    lineVisible: false
                },
            })
            tagsList.forEach(tag => {
                let tag_title = pdfh(tag, 'a&&Text')
                Sky.d.push({
                    title: "““””" + tag_title.fontcolor("#FFFFFF"),
                    url: $(pdfh(tag, 'a&&href') + '?page=fypage#noHistory##immersiveTheme#').rule((tag_title) => {
                        const Sky = $.require('hiker://page/Sky')
                        setPageTitle(tag_title)
                        Sky.yijiParse(MY_URL)
                        setResult(Sky.d)
                    }, tag_title),
                    col_type: 'flex_button',
                    extra: {
                        'backgroundColor': Sky.getRangeColors()
                    }
                })
            })
            Sky.d.push({
                col_type: 'blank_block'
            })
        }
        if (series) {
            Sky.d.push({
                title: '系列 : ',
                url: Sky.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            let series_title = pdfh(series, 'a&&Text')
            Sky.d.push({
                title: "““””" + series_title.fontcolor("#FFFFFF"),
                url: $(pdfh(series, 'a&&href') + '?page=fypage#noHistory##immersiveTheme#').rule((series_title) => {
                    const Sky = $.require('hiker://page/Sky')
                    setPageTitle(series_title)
                    Sky.yijiParse(MY_URL)
                    setResult(Sky.d)
                }, series_title),
                col_type: 'scroll_button',
                extra: {
                    'backgroundColor': Sky.getRangeColors()
                }
            })
            Sky.d.push({
                col_type: 'blank_block'
            })
        }
        if (makers) {
            Sky.d.push({
                title: '發行商 : ',
                url: Sky.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            let makers_title = pdfh(makers, 'a&&Text')
            Sky.d.push({
                title: "““””" + makers_title.fontcolor("#FFFFFF"),
                url: $(pdfh(makers, 'a&&href') + '?page=fypage#noHistory##immersiveTheme#').rule((makers_title) => {
                    const Sky = $.require('hiker://page/Sky')
                    setPageTitle(makers_title)
                    Sky.yijiParse(MY_URL)
                    setResult(Sky.d)
                }, makers_title),
                col_type: 'scroll_button',
                extra: {
                    'backgroundColor': Sky.getRangeColors()
                }
            })
            /*Sky.d.push({
                col_type: 'line_blank'
            })*/
        }
        if (directors) {
            Sky.d.push({
                title: '導演 : ',
                url: Sky.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            let directors_title = pdfh(directors, 'a&&Text')
            Sky.d.push({
                title: "““””" + directors_title.fontcolor("#FFFFFF"),
                url: $(pdfh(directors, 'a&&href') + '?page=fypage#noHistory##immersiveTheme#').rule((directors_title) => {
                    const Sky = $.require('hiker://page/Sky')
                    setPageTitle(directors_title)
                    Sky.yijiParse(MY_URL)
                    setResult(Sky.d)
                }, directors_title),
                col_type: 'scroll_button',
                extra: {
                    'backgroundColor': Sky.getRangeColors()
                }
            })
            Sky.d.push({
                col_type: 'blank_block'
            })
        }
        if (labelsList) {
            Sky.d.push({
                title: '標簽 : ',
                url: Sky.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            labelsList.forEach(label => {
                let label_title = pdfh(label, 'a&&Text')
                Sky.d.push({
                    title: "““””" + label_title.fontcolor("#FFFFFF"),
                    url: $(pdfh(label, 'a&&href') + '?page=fypage#noHistory##immersiveTheme#').rule((
                        label_title) => {
                        const Sky = $.require('hiker://page/Sky')
                        setPageTitle(label_title)
                        Sky.yijiParse(MY_URL)
                        setResult(Sky.d)
                    }, label_title),
                    col_type: 'scroll_button',
                    extra: {
                        'backgroundColor': Sky.getRangeColors()
                    }
                })
            })
            Sky.d.push({
                col_type: 'line_blank'
            })
        }

        const CiliList = pdfa(html, '.min-w-full&&tr')
        if (CiliList.length > 0) {
            Sky.d.push({
                title: '本小站磁力' + CiliList.length + "條",
                url: Sky.empty,
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false
                },
            })
        } else {
            //Sky.BTshowParse(num);
        }
        CiliList.forEach((item, index) => {
            Sky.d.push({
                title: pdfh(item, 'a&&Text'),
                url: pdfh(item, 'a&&href'),
                desc: (index + 1).toString().padStart(2, "0") + " 💽 " + Sky.formatNumber(pdfh('<table>' + item + '</table>', 'td,1&&Text')) + " 📆 " + pdfh('<table>' + item + '</table>', 'td,2&&Text'),
                pic_url: "https://img.vinua.cn/images/Ooz4R.jpeg",
                col_type: 'avatar'
            })
        })

        Sky.d.push({
            title: '““””' + "一已經到底了一".fontcolor("grey")
                .small(),
            url: Sky.empty,
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            }
        })
        setResult(Sky.d)
    },
    formatNumber: function(input) {
        // 分離整數、小數和單位
        var regex = /(\d+)(\.\d+)?([a-zA-Z]+)/;
        var match = input.match(regex);
        if (match) {
            var integerPart = match[1].toString(); // 獲取整數部分
            var decimalPart = match[2] ? match[2].slice(1).toString() : '0'; // 如果没小數部分，默認為 '0'
            var unitPart = match[3]; // 獲取單位部分              
            // 對整數部分進行補零
            integerPart = integerPart.padStart(2, '0');
            // 對小數部分進行補零  
            decimalPart = decimalPart.padEnd(2, '0');
            // 合併結果
            return integerPart + '.' + decimalPart + unitPart;
        } else {
            return input
        }
    },
    BTshowParse: (識別碼) => {
        try {
            var btsow = "https://btsow.motorcycles/search/" + 識別碼
            var BTlist = pdfa(fetch(btsow), "body&&.data-list&&.row:not(.hidden-xs)");
            if (BTlist.length > 0) {
                Sky.d.push({
                    title: 'BTshow磁力' + BTlist.length + "條",
                    url: btsow,
                    col_type: 'text_center_1',
                    extra: {
                        lineVisible: false
                    },
                })
            }
            BTlist.forEach((item, index) => {
                var url = getMyVar("BTcili");
                Sky.d.push({
                    title: '<b><small><font color="#4682B4"> ' + pdfh(item, 'a&&title') + '</font></small>',
                    desc: (index + 1).toString().padStart(2, "0") + " 💽" + Sky.formatNumber(pdfh(item, '.size&&Text')) + " 📆 " + pdfh(item, '.date&&Text'),
                    img: "https://img.vinua.cn/images/Ocqpj.png",
                    url: "https:" + pdfh(item, 'a&&href') + $('').lazyRule(() => {
                        var url = pdfh(request(input, {}), '#magnetOpen&&a&&href');
                        putMyVar("BTcili", url)
                        return url
                    }),
                    col_type: "avatar",
                })
            })
        } catch {}
    },
    //一級.簡
    yijiParse: (url) => {
        putMyVar("MY_TYPE", "一級")
        var page = getMyVar("page", MY_PAGE + "")
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        addListener("onClose", $.toString(() => {
            clearMyVar("yurl");
            clearMyVar("ysort");
            clearMyVar("page")
        }));
        if (page == 1) {
            Sky.d.push({
                img: 'https://s2.loli.net/2025/05/07/jEhr9ifg3NVowdq.png',
                url: 'hiker://empty',
                col_type: 'pic_1_full',
            })
        }
        url = getMyVar("yurl", url)
        url = url.replace(/(\?page=\d+|\&page=\d+|$)/, (match) => {
            if (match.startsWith('?') || match.startsWith('&')) {
                return match.charAt(0) + 'page=' + page;
            } else {
                return (url.includes('?') ? '&page=' : '?page=') + page;
            }
        });
        //log(url)
        Sky.pageAdd(page)
        const html = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        })
        try {
            var title = "““””" + pdfh(html, "body&&.rounded-full&&img&&alt").bold();
            var img = pdfh(html, "body&&.rounded-full&&img&&src");
            var desc = "““””" + pdfh(html, ".mt-2.text-sm.text-nord9&&p&&Text").fontcolor("#4169E1").small() + "\n" + pdfh(html, ".mt-2.text-sm.text-nord9&&p,1&&Text").fontcolor("#00CED1").small();
            Sky.d.push({
                title: title,
                desc: desc,
                img: img,
                url: "hiker://empty",
                col_type: "movie_1_left_pic"
            })
        } catch {}
        Sky.DynamicSort(html)
        Sky.videoType(html, page)
    },

    videoType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch (e) {
            var pages = 1
        }
        const list = pdfa(html, 'body&&.thumbnail')
        list.forEach(item => {
            var title = pdfh(item, '.lozad&&alt');
            Sky.d.push({
                title: title,
                url: $(pdfh(item, 'a&&href') + '#noHistory##gameTheme#').rule(() => {
                    const Sky = $.require('hiker://page/Sky')
                    Sky.videoParse(MY_URL)
                    setResult(Sky.d)
                    if (Sky.taskList.length > 0) {
                        be(Sky.taskList)
                    }
                }),
                pic_url: pdfh(item, '.lozad&&data-src').replace("cover-t", "cover-n") + '@Referer=' + Sky.url,
                desc: pdfh(item, 'a&&alt').toUpperCase().replace("-CHINESE-SUBTITLE", "🀄️").replace("-UNCENSORED-LEAK", "✅🈚️") + "⏰" + pdfh(item, '.absolute,-1&&Text'),
                col_type: 'movie_2',
                extra: page ? {
                    longClick: Sky.pageMoveto(page, pages),
                    pageTitle: title
                } : {
                    pageTitle: title
                }
            })
        })
    },

    articlesType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        const list = pdfa(html, '.grid&&.rounded-lg')
        list.forEach(item => {
            Sky.d.push({
                title: pdfh(item, 'img&&alt'),
                url: $(pdfh(item, 'a&&href') + '#noHistory##gameTheme#').rule(() => {
                    const Sky = $.require('hiker://page/Sky')
                    const html = fetch(MY_URL, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
                        }
                    })
                    Sky.d.push({
                        title: pdfh(html, 'article&&Html'),
                        col_type: 'rich_text'
                    })
                    setResult(Sky.d)
                }),
                pic_url: pdfh(item, 'img&&data-src') + '@Referer=' + Sky.url,
                col_type: 'movie_2',
                extra: page ? {
                    longClick: Sky.pageMoveto(page, pages)
                } : ""
            })
        })
    },


    avatarType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        const list = pdfa(html, '.mx-auto.grid&&li')
        list.forEach(item => {
            Sky.d.push({
                title: pdfh(item, '.space-y-2&&Text').replace(/\(.*\)/, "").replace("影片", ""),
                url: $(pdfh(item, 'a&&href') + '?page=fypage#noHistory##gameTheme#').rule(() => {
                    const Sky = $.require('hiker://page/Sky')
                    Sky.yijiParse(MY_URL)
                    setResult(Sky.d)
                }),
                pic_url: pdfh(item, 'img&&src') ? (pdfh(item, 'img&&src') + '@Referer=' + Sky.url) : "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/12/63/3e/12633eff-07b7-0fcd-d9be-00b345ec5aed/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/600x600bb.png",
                col_type: 'card_pic_3',
                extra: page ? {
                    longClick: Sky.pageMoveto(page, pages)
                } : ""
            })
        })
    },


    tagsType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        const list = pdfa(html, '.gap-4&&div')
        list.forEach(item => {
            Sky.d.push({
                title: pdfh(item, 'a&&Text'),
                url: $(pdfh(item, 'a&&href') + '?page=fypage#noHistory#').rule(() => {
                    const Sky = $.require('hiker://page/Sky')
                    Sky.yijiParse(MY_URL)
                    setResult(Sky.d)
                }),
                col_type: 'text_4',
                extra: page ? {
                    longClick: Sky.pageMoveto(page, pages)
                } : ""
            })
        })
    },


    updateAvatar: (param) => {
        const actressesHtml = fetch(param.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        })
        updateItem({
            pic_url: pdfh(actressesHtml, '.object-cover.object-top.w-full.h-full&&src'),
            //col_type: 'card_pic_3',
            extra: {
                id: param.index
            }
        })
    },

    setDesc: (desc) => {
        function substr(str, maxLength) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    len += 2;
                } else {
                    len++;
                }
                if (len > maxLength) {
                    return str.slice(0, i) + '...';
                }
            }
            return str;
        }

        function setDesc(arr, desc, num) {
            //log(desc)
            if (desc == undefined) {
                return;
            }
            desc = desc.constructor == Array ? desc.join('<br>') : desc.small();
            if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, '').length == 0) {
                return;
            }

            const mark = 'desc';
            num = typeof(num) == 'undefined' ? 100 : num
            desc = desc.startsWith('　　') ? desc : '　　' + desc;
            desc = desc.replace(/'/g, "&#39;");
            desc = desc.replace(/\r\n/g, "<br>");
            desc = desc.replace(/\r/g, "<br>");
            desc = desc.replace(/\n/g, "<br>");
            let sdesc = substr(desc, num);

            var colors = {
                show: "#000000",
                hide: "grey"
            }

            var lazy = $(`#noLoading#`).lazyRule((dc, sdc, m, cs) => {
                var show = storage0.getItem(m, '0');
                var title = findItem('desc').title;
                var re = /(<\/small><br>.*?>).+/g;
                var exp = '展開:';
                var ret = '收起:';
                if (show == '1') {
                    updateItem('desc', {
                        title: title
                            .replace(ret, exp)
                            .replace(re, '$1' + sdc + '</small>')
                            .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.hide + '$2')

                    })
                    storage0.setItem(m, '0');
                } else {
                    updateItem('desc', {
                        title: title
                            .replace(exp, ret)
                            .replace(re, '$1' + dc + '</small>')
                            .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.show + '$2')
                    })
                    storage0.setItem(m, '1');
                }
                return `hiker://empty`
            }, desc, sdesc, mark, colors)
                var sc = storage0.getItem(mark, '0') == '0' ? '展開:' : '收起:';
                var dc = storage0.getItem(mark, '0') == '0' ? sdesc : desc;
                var cs = storage0.getItem(mark, '0') == '0' ? colors.hide : colors.show;
                arr.push({
                title: '☠' + '<b><font color="#FFBF00">劇情簡介	</font></b>' + "<small><a style='text-decoration: none;' href='" + lazy + "'>" + sc + '</a></small><br><font color="' + cs + '">' + `${dc}` + '</small>',
                col_type: 'rich_text',
                extra: {
                    id: 'desc',
                    lineSpacing: 6,
                    textSize: 15,
                    lineVisible: true,
                }
            })
        }
        setDesc(Sky.d, desc, 90);
    },
}
$.exports = Sky
