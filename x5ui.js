function isEqual(x, y, excludeKeys) {
  excludeKeys = excludeKeys != undefined ? excludeKeys : [];
  const ok = Object.keys;
  const tx = typeof x;
  const ty = typeof y;
  if (x && y && tx === "object" && tx === ty) {
    const keysX = ok(x).filter(key => !excludeKeys.includes(key));
    const keysY = ok(y).filter(key => !excludeKeys.includes(key));
    if (keysX.length !== keysY.length) {
      return false;
    }
    return keysX.every((key) => isEqual(x[key], y[key], excludeKeys));
  }
  return x === y;
}

//默认
var sconfig = {
  newW: false, //新窗口打开
  mark: "#immersiveTheme#", //链接标识
  url: "hiker://page/er?rule=" + MY_RULE.title + "&url={url}", //使用二级
  longc: false, //启用长按
  x5lc: true, //图片菜单
  x5h: '190', //x5浏览器高度  为空默认 3列封面默认190
  zoom: true,
  custom: true, //自定义 定义下方内容
  /*imgh: 164, //图片高度  
  imgw: 123, //图片宽度*/
  speed: 5, //速度
  fit: 'cover', //object-fit 样式
  autoplay: true, //自动播放
  show: 3, //显示数量
  scroll: 1, //每次滑动数量 
}

var x5f = 'hiker://files/rules/zetalpha/SlideX.html';
var x5ui = 'https://raw.githubusercontent.com/ccc0303ccc/Sky/main/x5ui.js'; //远程js位置

var x5debug = false;
var x5plusRule="empty";

$.extend({
  GoS: {
    get: function (sn, key) {
      return storage0.getItem('sconfig', sfig)[key];
    },
    save: function (cof, key, input) {
      var o = storage0.getItem('sconfig', cof);
      o[key] = input;
      storage0.setItem('sconfig', o);
    }
  },
  getDisplay: function () {
    let context;
    if (typeof getCurrentActivity == 'function') {
      context = getCurrentActivity();
    } else {
      context = com.example.hikerview.ui.Application().getContext();
    }
    var dm = context.getResources().getDisplayMetrics();
    return dm;
  },
  geOrientation: function () {
    let context;
    if (typeof getCurrentActivity == 'function') {
      context = getCurrentActivity();
    } else {
      context = com.example.hikerview.ui.Application().getContext();
    }
    var orientation = context.getResources().getConfiguration().orientation;
    return orientation;
  },
  getDensity: function (dm) {
    if (dm != undefined) {
      dm = this.getDisplay();
    }
    var z = dm.density;
    var dpix = 1;
    switch (z) {
      case 1.5:
        dpix = 2;
        break;
      case 3:
        dpix = 1;
        break;
    }
    return dpix;
  },
  getZoom: function () {
    var dm = this.getDisplay();
    var o = this.geOrientation();
    var w = dm.widthPixels;
    var h = dm.heightPixels;
    var z = dm.density;
    var zoom = 1;
    var dpi = dm.densityDpi; //dpi //3
    w = w / z;
    if (o == 1) {
      zoom = w / dpi;
    } else {
      log('横屏')
      zoom = w / dpi;
    }
    if (zoom < 1) {
      zoom = 1;
    }
    return zoom.toFixed(3);
  },
  sdata: {
    self: sconfig,
    name: 'slick_sconfig.json',
    getFile: function () {
      return getPath('hiker://files/cache/' + this.name);
    },
    onfile: function () {
      if (!fileExist(this.name) || readFile(this.name, 0) == '') {
        writeFile(this.name, JSON.stringify({}));
      }
    },
    get: function (key, path) {
      this.onfile();
      var data = {};
      try {
        data = JSON.parse(readFile(this.getFile(), 0));
      } catch (e) {
        log(e.message)
      }
      if (key == undefined) {
        return data;
      } else {
        if (MY_RULE.title == '聚阅√') {
          key = MY_RULE.title + '-' + key;
        }
      }
      if (path != undefined) {
        if (data[key] == undefined) {
          data[key] = {};
        }
        return data[key][path] != undefined ? data[key][path] : {};
      } else {
        return data[key] != undefined ? data[key] : {};
      }
    },
    set: function (key, value, path) {
      var type = typeof (this.self[path]);
      switch (type) {
        case "string":
          break;
        case "number":
          value = parseInt(value);
          break;
        case "boolean":
          break;
      }

      this.onfile();
      if (MY_RULE.title == '聚阅√') {
        key = MY_RULE.title + '-' + key;
      }
      var data = this.get();
      if (data[key] == undefined) {
        data[key] = {};
      }
      if (path != undefined) {
        data[key][path] = value;
      } else {
        data[key] = value;
      }

      writeFile(this.getFile(), JSON.stringify(data, null, 2));
    },
  },
  imgsize: function (num, sn) {
    let x5 = 190;
    switch (num) {
      case '1':
        x5 = 210;
        break;
      case '2':
        x5 = 140;
        break;
      case '3':
        x5 = 190;
        break;
      default:
      // code
    }
    return x5;
  },
})

$.exports.show = function (arr,data,cfg, extras) {
  var x5clear = false;
  extras = !extras ? {} : extras;
  Object.entries(extras).forEach(([key, value]) => {
    if(key=="x5plusRule"){
      eval(key + " = "+$.stringify(value));
    }else{
      eval(key + " = '" + value+ "'");
    }
  });
  //参数
  cfg=cfg?cfg:{};
  let scfg=cfg;

  var sn = MY_RULE.title;
  if (sn == "聚阅√") {
    cfg['url'] = "聚阅";
    var info = storage0.getMyVar('一级源接口信息');
    sn = info.name;
    if (typeof cfg['stype'] == 'undefined') {
      cfg['stype'] = info.type;
      cfg['sname'] = info.name;
    }
  }

  storage0.putMyVar("Slide_cfg", cfg);

  if (MY_RULE.title == "聚阅√") {
    if (x5clear) {
      refreshX5WebView('about:blank');
    }
    clearItem("sconfig");
  }

  if (data.length > 0) {
    if (!fileExist(x5f)) {
      arr.push({
        title: '““””<small>輪播組件尚未導入❗️點我導入</small>',
        col_type: 'text_center_1',
        url: $('').lazyRule(() => {
          eval(request('https://gitee.com/zetalpha/hikerview/raw/master/global/Ver.js'));
          checkInFiles(["SlideX.html"]);
          refreshPage();
          return 'hiker://empty';
        })
      })
    } else {
      var s = $.sdata.get(sn);
      //log(s)
      scfg=Object.assign({},s,scfg);
      //log(scfg)

      if (Object.keys(s).length === 0) {
        //log('空')
        cfg = Object.assign({}, sconfig, cfg);
      } else {
        //log('非空')
        cfg = Object.assign({}, cfg, s);
      }

      if (x5debug) {
        log('\n' + JSON.stringify(cfg))
      }
      //log(cfg)
      

      var x5h = '190&&list';
      if (!!cfg) {
        x5h = cfg.x5h ? cfg.x5h + '&&list' : x5h;
      }

      arr.push({
        col_type: 'x5_webview_single',
        url: getPath(x5f),
        desc: x5h,
        extra: {
          cls:"elelist",
          id:"x5_db_poster",
          imgLongClick: cfg.x5lc,
        }
      })
    }
  
    putVar("slide_rule", MY_RULE);
    putVar("slide_data", data);
    if (!isEqual(scfg, cfg)) {
      cfg = scfg;
      $.sdata.set(sn, cfg);
    }
    putVar("slide_cfg", cfg);
    putVar("slide_ui", x5ui);
    putMyVar("slide_x5", x5f);
    storage0.putMyVar("x5_plus", x5plusRule);
    putVar("slide_file", $.sdata.getFile());
  }
}

var mode = getParam('mode');
var d = [];

if (mode == 'set') {
  setPageTitle('轮播设置');
  var sn = MY_RULE.title;
  if (sn == "聚阅√") {
    sn = storage0.getMyVar('一级源接口信息').name
  }

  addListener("onClose",
    $.toString(() => {
      clearVar('slide_set');
      //clearVar('slide_cfg');
      clearVar('slide_height');
    })
  );
  x5f = getMyVar("slide_x5", x5f);

  putVar("slide_set", "1");
  //var sfig = storage0.getItem('sconfig', sconfig);
  var sfig = Object.assign({}, sconfig, $.sdata.get(sn));
  var px = $.getDisplay();
  //log(px)
  var zoom = 1;
  if (sfig['zoom'] != 'none') {
    zoom = sfig['zoom'];
  }

  if (getVar('slide_height') && !sfig['custom']) {
    sfig['x5h'] = parseInt(getVar('slide_height', '150')) + (sfig['notitle'] ? 10 : 40);
    clearVar('slide_height');
  }

  var c = getVar("slide_cfg") || "{}";
  var sc = Object.assign({}, JSON.parse(c), sfig);
  putVar("slide_cfg", sc);

  
  var lazy = $('#noLoading#').lazyRule((o, sn, k) => {
    o = $.sdata.get(sn);
    let t; t = o[k] === false ? true : false;
    $.sdata.set(sn, t, k);
    refreshPage(false)
    return 'hiker://empty'
  }, sfig, sn, 'action')

  function Tof(key) {
    var b = $.sdata.get(sn)[key];
    if (b == undefined) {
      $.sdata.set(sn, false, key);
      b = false;
    }
    if (b == true) {
      return 'http://123.56.105.145/tubiao/messy/55.svg';
    }
    if (b == false) {
      return 'http://123.56.105.145/tubiao/messy/63.svg';
    }
  }

  d.push({
    title: '預覽窗口',
    col_type: 'avatar',
    desc:(sfig['sort']||"顺序")+'\t',
    img: 'http://123.56.105.145/tubiao/ke/156.png',
    url: $("#noLoading#").lazyRule((sn)=>{
      let all_cols = ['顺序', '逆序', '乱序'];
      return $(all_cols, 1, '显示顺序')
        .select((sn) => {
          $.sdata.set(sn, input, 'sort');
          refreshPage(false);
          return 'hiker://empty';
        }, sn)
    },sn),
    extra:{
      LongClick: [{
        title: '調試:'+(sfig["debug"]||false?"开启":"关闭"), js: $.toString((o, sn, k) => {
          o = $.sdata.get(sn);
          let t; t = o[k] === false ? true : false;
          $.sdata.set(sn, t, k);
          refreshPage(false);
       },sfig, sn, 'debug')
      }]
    }
  },{
    col_type: 'x5_webview_single',
    url: getPath(x5f),
    desc: (sfig.x5h) + '&&list',
    extra: {
      imgLongClick: sfig.x5lc,
    }
  })
  let plusRule=storage0.getMyVar("x5_plus",x5plusRule);
  //log(plusRule)
  if(plusRule!="empty"){
    d.push({
      title:'外部自訂義設置',
      col_type:'text_icon',
      img:'http://123.56.105.145/tubiao/system/71.png',
      url:'hiker://empyt',
    })
    eval(plusRule)
  }

  d.push({
    title: '確認修改',
    img: 'http://123.56.105.145/tubiao/system/84.png',
    url: $('#noLoading#').lazyRule(() => {
      back(true);
      return 'hiker://empty';
    }),
    col_type: 'icon_small_3',
  })

  d.push({
    title: '恢復默認',
    img: 'http://123.56.105.145/tubiao/system/83.png',
    col_type: 'icon_small_3',
    url: $('#noLoading#').lazyRule((sc, sn) => {
      var ss = storage0.getMyVar("Slide_cfg", sc);
      var x5h=ss['x5h'];
      if(x5h==null){
        x5h=sc['x5h'];
      }
      ss = Object.assign({}, sc, ss, { 'x5h':x5h  });
      log(ss)
      $.sdata.set(sn, ss);
      refreshPage();
      return 'hiker://empty';
    }, sconfig, sn)
  }, {
    title: '檢查更新',
    img: 'http://123.56.105.145/tubiao/system/89.png',
    col_type: 'icon_small_3',
    url: $('#noLoading#').lazyRule((x5u) => {
      if (x5u.startsWith("http")) {
        deleteCache(x5u);
        eval(request('https://gitee.com/zetalpha/hikerview/raw/master/global/Ver.js'));
        Updata(["SlideX.html"], true);
        refreshPage();
      } else {
        toast('当前是调试模式');
      }
      return 'hiker://empty';
    }, getVar("slide_ui"))
  })

  if (MY_RULE.title != "聚阅√") {
    d.push({
      title: '新窗口打開',
      url: lazy.replace('action', 'newW'),
      col_type: "text_icon",
      desc: "",
      pic_url: Tof('newW'),
    });
  } else {
    $.sdata.set(sn, false, 'newW');
  }


  d.push({
    title: '啟用長按',
    url: lazy.replace('action', 'longc'),
    col_type: "text_icon",
    desc: "",
    pic_url: Tof('longc'),
  }, {
    title: '圖片菜單',
    url: lazy.replace('action', 'x5lc'),
    col_type: "text_icon",
    desc: "",
    pic_url: Tof('x5lc'),
  }, {
    title: '滑動指示',
    url: lazy.replace('action', 'dots'),
    col_type: "text_icon",
    desc: "",
    pic_url: Tof('dots'),
  }, {
    title: '無標題',
    url: $('#noLoading#').lazyRule((o, sn, k) => {
      o = $.sdata.get(sn);
      let t;
      let x5;
      if (o[k] === false) {
        x5 = parseInt(o['x5h']) - 30;
        t = true;
      }
      if (o[k] === true) {
        x5 = parseInt(o['x5h']) + 30;
        t = false;
      }
      //log('新:'+x5);
      $.sdata.set(sn, x5, 'x5h');
      $.sdata.set(sn, t, k);
      refreshPage(false)
      return 'hiker://empty';
    }, sfig, sn, 'notitle'),
    col_type: "text_icon",
    desc: "",
    pic_url: Tof('notitle'),
  }, {
    title: '自動縮放',
    url: lazy.replace('action', 'zoom'),
    pic_url: Tof('zoom'),
    col_type: 'text_icon',
  });

  d.push({
    title: '鏈接標示',
    desc: '默認#immersiveTheme#',
    url: $.toString((sn) => {
      let all_cols = ['', '#fullTheme#', '#gameTheme#', '#immersiveTheme#'];
      all_cols.unshift(input);
      return $(all_cols, 1, '链接标识')
        .select((sn) => {
          $.sdata.set(sn, input, 'mark');
          refreshPage(false);
          return 'hiker://empty';
        }, sn)
    }, sn),
    col_type: 'input',
    extra: {
      defaultValue: sfig['mark'],
    }
  })

  d.push({
    title: '鏈接',
    url: $.toString((sn) => {
      let all_cols = ["hiker://page/er?rule=" + MY_RULE.title + "&url={url}", "聚阅", "hiker://empty?&url={url}","hiker://empty##{url}","{url}"];
      all_cols.unshift(input)
      return $(all_cols, 1, '{url}会替换目标链接')
        .select((sn) => {
          $.sdata.set(sn, input, 'url');
          refreshPage(false);
          return 'hiker://empty'
        }, sn)
    }, sn),
    col_type: 'input',
    extra: {
      defaultValue: sfig['url'],
      type: 'textarea',
      height: -1
    }
  })
  if (sfig.longc) {
    d.push({
      title: '長按鏈接',
      desc: '默認空，對應傳入對象的lurl',
      url: $.toString((sn) => {
        let all_cols = ["hiker://page/er?rule=" + MY_RULE.title + "&url={url}", "hiker://empty?&url={url}", "hiker://empty##{url}", "{url}"];
        all_cols.unshift(input)
        return $(all_cols, 1, '{url}会替换目标链接')
          .select((sn) => {
            $.sdata.set(sn, input, 'lurl');
            refreshPage(false);
            return 'hiker://empty'
          }, sn)
      }, sn),
      col_type: 'input',
      extra: {
        defaultValue: sfig['lurl'],
        type: 'textarea',
        height: -1
      }
    })
  }

  if (sfig.custom) {
    d.push({
      title: 'x5高度',
      col_type: 'input',
      desc: '默認190',
      url: $.toString((sn, zoom) => {
        if (zoom == 'auto') {
          var px = $.getDisplay();
          zoom = px.widthPixels / px.density / 384;
        }
        let all_cols = [140, 190, 210];
        all_cols.unshift(Number(input));
        return $(all_cols, 1, '默认190')
          .select((sn) => {
            $.sdata.set(sn, input, 'x5h')
            refreshPage(false);
            return 'hiker://empty'
          }, sn)
      }, sn, zoom),
      extra: {
        onChange: $.toString((sn) => {
          $.sdata.set(sn, input, 'x5h');
        }, sn),
        defaultValue: $.sdata.get(sn)['x5h'] == undefined ? 190 : sfig["x5h"],
        type: 'number'
      }
    })
  }

  d.push({
    title: '自定義',
    url: lazy.replace('action', 'custom'),
    col_type: "text_icon",
    desc: "",
    pic_url: Tof('custom'),
  });

  if (sfig['custom'] == true) {
    d.push({
      title: '自動播放',
      url: lazy.replace('action', 'autoplay'),
      col_type: "text_icon",
      desc: "",
      pic_url: Tof('autoplay'),
    });
    d.push({
      title: 'object-fit樣式',
      desc: '默認cover',
      url: $.toString((sn) => {
        let all_cols = ["", "fill", "cotain", "cover", "none", "scale-down", "initial", "inherit"];
        all_cols.unshift(input);
        return $(all_cols, 1, '默认cover')
          .select((sn) => {
            $.sdata.set(sn, input, 'fit');
            refreshPage(false);
            return 'hiker://empty'
          }, sn)
      }, sn),
      col_type: 'input',
      extra: {
        defaultValue: sfig['fit'],
        type: 'textarea',
        height: -1
      }
    }, {
      title: '播放速度',
      desc: '單位秒',
      col_type: 'input',
      url: $.toString((sn) => {
        $.sdata.set(sn, input, 'speed');
        refreshPage(false);
        return 'hiker://empty'
      }, sn),
      extra: {
        onChange: $.toString((sn) => {
          var sp = Number(input);
          if (sp > 0) {
            $.sdata.set(sn, sp, 'speed');
          }
        }, sn),
        defaultValue: sfig['speed'],
        type: 'number'
      }
    })

    var sw = sfig['show'];
    if (sw == '0' || sw == undefined || sw == 0) {
      sw = 1;
    } else {
      sw = sfig['show'];
    }

    d.push({
      title: '顯示數量',
      col_type: 'input',
      desc: '默認3',
      url: $.toString((sn) => {
        let all_cols = [1, 2, 3];
        all_cols.unshift(input);
        return $(all_cols, 1, '默认3')
          .select((sn) => {
            $.sdata.set(sn, input, 'show');
            if (Number(input) <= 3) {
              $.sdata.set(sn, input, 'scroll');
              var s = $.imgsize(input, sn);
              log(s);
              $.sdata.set(sn, s, 'x5h');
            }
            refreshPage(false);
            return 'hiker://empty';
          }, sn)
      }, sn),
      extra: {
        onChange: $.toString((sn) => {
          $.sdata.set(sn, input, 'show');
        }, sn),
        defaultValue: sw,
        type: 'number'
      }
    })

    var sl = sfig['scroll'];
    if (sl == '0' || sl == undefined || sl == 0) {
      sl = 1;
    } else {
      sl = sfig['scroll'];
    }

    d.push({
      title: '滑動數量',
      col_type: 'input',
      desc: '默認3',
      url: $.toString((sn) => {
        $.sdata.set(sn, input, 'scroll');
        refreshPage(false);
        return 'hiker://empty'
      }, sn),
      extra: {
        defaultValue: sl,
        type: 'number'
      }
    })
  }
  setResult(d);
}
