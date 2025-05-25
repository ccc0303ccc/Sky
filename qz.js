let wz = MY_PARAMS.wz;
if (wz == '直播聚合') {
    host = 'http://api.vipmisss.com:81/xcdsw/'
} else {
    host = 'http://api.maiyoux.com:81/mf/'
    //host='http://api.hclyz.com:81/mf/'
}
if (MY_PAGE == 1) {
    var 直播聚合 = request(host + 'json.txt')
    var data = JSON.parse(直播聚合).pingtai;
    data.forEach(data => {
        d.push({
            title: data.title,
            desc: data.Number,
            img: data.xinimg,
            url: 'hiker://empty@rule=js:$.require("csdown").zhibojuheerji1()',
            col_type: 'card_pic_3_center',
            extra: {
                host: `${host}${data.address}`,
                wz: wz,
            }
        })
    })
}
} catch (e) {
    log(e.message)
    toast('看不了')
}
setResult(d)
},
zhibojuheerji1: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let host = MY_PARAMS.host;
        try {
            let list = JSON.parse(fetch(host)).zhubo;
            //log(list)
            list.forEach(data => {
                if (!data.title.includes('9999')) {
                    d.push({
                        title: data.title,
                        img: data.img,
                        url: data.address,
                        col_type: 'movie_2'
                    })
                }
            })
        } catch {}
        setResult(d)
    },
    madou: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        //md5加密
        function md5(str) {
            return CryptoJS.MD5(str).toString();
        }
        var t = Math.floor(Date.now());
        let pg = getParam('page');
        var md = [{
            title: '首页&频道&标签',
            id: '1&2&3',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/movie/111.svg&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/movie/112.svg&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/movie/113.svg&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/movie/114.svg&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/movie/122.svg'
        }];
        if (MY_PAGE == 1) {
            Cate(md, 'md', d);
            d.push({
                col_type: 'line',
            }, {
                col_type: 'big_blank_block',
            }, {
                col_type: 'big_blank_block',
            });
        }
        let 分类 = getMyVar('md', '1');

        if (分类 == 1) {
            var sign = md5('list_row=20&page=' + pg + '&timestamp=' + t + '&type=2' + '&m}q%ea6:LDcmS?aK)CeF287bPvd99@E,9Up^');
            var data0 = {
                "encode_sign": sign,
                "list_row": "20",
                "page": pg,
                "timestamp": t,
                "type": "2"
            };
            var data = mdEncrypt(JSON.stringify(data0));
            var body = 'post-data=' + data;
            var url = 'https://api.nzp1ve.com/video/listcache';

        } else {
            var sign = md5('timestamp=' + t + '&m}q%ea6:LDcmS?aK)CeF287bPvd99@E,9Up^');
            var data0 = {
                "encode_sign": sign,
                "timestamp": t
            };
            var data = mdEncrypt(JSON.stringify(data0));
            var body = 'post-data=' + data;
            if (分类 == 2) {
                var url = 'https://api.nzp1ve.com/video/channel';
            } else if (分类 == 3) {
                var url = 'https://api.nzp1ve.com/video/tags';
            }
        };
        var html = fetch(url, {
            headers: {
                'suffix': '173150',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body,
            method: 'POST'
        });

        let html1 = JSON.parse(html).data;
        var iv0 = JSON.parse(html).suffix;
        let html2 = mdDecrypt(html1);
        if (分类 == 1) {
            var list = JSON.parse(html2).data.data;
            list.forEach((data) => {
                var tag = data.tags;
                var str1 = '';
                for (i in tag) {
                    var str1 = str1 + tag[i].name + '   ';
                }
                d.push({
                    title: data.title,
                    desc: str1,
                    pic_url: data.panorama.replace('_sync.webp', '.jpg'),
                    col_type: "pic_1",
                    url: data.video_url,
                })
            })
        } else if (分类 == 2) {
            var list = JSON.parse(html2).data;
            list.forEach((data) => {
                d.push({
                    title: data.name,
                    desc: data.total + '个片儿',
                    pic_url: data.image,
                    col_type: "icon_3",
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").madoupindao()',
                    extra: {
                        id: data.id,
                    }
                })
            })
        } else if (分类 == 3) {
            var list = JSON.parse(html2).data;
            list.forEach((data) => {
                d.push({
                    title: data.name,
                    //pic_url:data.thumb,
                    col_type: "text_3",
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").madoubiaoqian()',
                    extra: {
                        id: data.id,
                    }
                })
            })
        }
        setResult(d)
    },
    madoupindao: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        try {
            //md5加密
            function md5(str) {
                return CryptoJS.MD5(str).toString();
            }
            var t = Math.floor(Date.now());
            var t0 = Math.floor(Date.now() / 1000);
            let id = MY_PARAMS.id;
            let p = getParam('page');
            var sign = md5('channel=' + id + '&list_row=60&page=' + p + '&timestamp=' + t + '&type=2&m}q%ea6:LDcmS?aK)CeF287bPvd99@E,9Up^'); //log(sign)

            let data0 = {
                "channel": id,
                "encode_sign": sign,
                "list_row": "60",
                "page": p,
                "timestamp": t,
                "type": "2"
            }
            //log(data0)
            var data = mdEncrypt(JSON.stringify(data0));
            //log(data)
            var body = 'post-data=' + data;
            var url = 'https://api.nzp1ve.com/video/listcache';
            var html = fetch(url, {
                headers: {
                    'suffix': '173150',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body,
                method: 'POST'
            });
            //log(html)

            let html1 = JSON.parse(html).data;
            //log(html1)
            var iv0 = JSON.parse(html).suffix;
            //log(iv0);
            let html2 = mdDecrypt(html1);
            //log(html2)

            var list = JSON.parse(html2).data.data;
            //log(list);
            list.forEach((data) => {
                var tag = data.tags;
                var str1 = '';
                for (i in tag) {
                    var str1 = str1 + tag[i].name + '   ';
                }
                d.push({
                    title: data.title,
                    desc: str1,
                    pic_url: data.panorama.replace('_sync.webp', '.jpg').replace('_longPreview', ''),
                    col_type: "pic_1",
                    url: data.video_url,
                })
            })
        } catch {}
        setResult(d)
    },
    madoubiaoqian: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        try {
            //md5加密
            function md5(str) {
                return CryptoJS.MD5(str).toString();
            }
            var t = Math.floor(Date.now());
            var t0 = Math.floor(Date.now() / 1000);
            let id = MY_PARAMS.id;
            let p = getParam('page');
            var sign = md5('list_row=60&page=' + p + '&tags=' + id + '&timestamp=' + t + '&type=2&m}q%ea6:LDcmS?aK)CeF287bPvd99@E,9Up^'); //log(sign)

            let data0 = {
                "encode_sign": sign,
                "list_row": "60",
                "page": p,
                "tags": id,
                "timestamp": t,
                "type": "2"
            }
            //log(data0)
            var data = mdEncrypt(JSON.stringify(data0));
            //log(data)
            var body = 'post-data=' + data;
            var url = 'https://api.nzp1ve.com/video/listcache';
            var html = fetch(url, {
                headers: {
                    'suffix': '173150',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body,
                method: 'POST'
            });
            //log(html)

            let html1 = JSON.parse(html).data;
            //log(html1)
            var iv0 = JSON.parse(html).suffix;
            //log(iv0);
            let html2 = mdDecrypt(html1);
            //log(html2)

            var list = JSON.parse(html2).data.data;
            //log(list);
            list.forEach((data) => {
                var tag = data.tags;
                var str1 = '';
                for (i in tag) {
                    var str1 = str1 + tag[i].name + '   ';
                }
                d.push({
                    title: data.title,
                    desc: str1,
                    pic_url: data.panorama.replace('_sync.webp', '.jpg').replace('_longPreview', ''),
                    col_type: "pic_1",
                    url: data.video_url,
                })
            })
        } catch {}
        setResult(d)
    },
}
}
$.exports = csdown
