/**
 * 验证手机号码或电话号码
 */
function checkMobileAndTel(value) {
  return /^1(3|4|5|7|8)\d{9}$/.test(value)
}

/**
 * 去除左右空格
 */
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "")
}

/*判断是否为空*/
function checkNoNull(val) {
  return trim(val).length == 0 ? true : false
}

/*秒转换成时间*/
function formatTime(second) {
  return [parseInt(second / 60 / 60) + '时', parseInt(second / 60 / 60) + '分', second % 60 + '分'].join(",").replace(/,/g, '')
}

/*时间戳转北京时间*/
function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
}

/*日期格式化*/
function formatDate(now, ff) {
  var year = now.getFullYear()
  var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  if (ff == 'Y-m-d') {
    return year + "-" + month + "-" + date
  } else if (ff == 'Y-m-d H:i:s') {
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
  } else if (ff == 'Y-m-d H:i') {
    return year + "-" + month + "-" + date + " " + hour + ":" + minute
  }
}

function format(time, ff) {
  if (time.length == 10) time = time * 1000
  var d = new Date(time)
  return formatDate(d, ff)
}

function toast(msg, icon) {
  var icon = icon ? icon : 'loading'
  wx.showToast({
    title: msg,
    icon: icon
  })
}

function getUrlParam(name, url) {
  let param = url.substr(url.indexOf('?') + 1);
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = param.match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}

function wx_login(cb, that) { //登录
  wx.login({
    success: function(e) {
      // 查看是否授权
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log(res);
                let userInfo = res.userInfo;
                let code = e.code;
                wx.setStorageSync('userInfo', userInfo)
                that.wxRequest(
                  '', {
                    HTTP_API: 'vv/usercenter/api/user/third',
                    code: code,
                    platform: 'wechatapp',
                    nickname: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    gender: userInfo.gender,
                    country: userInfo.country,
                    province: userInfo.province,
                    city: userInfo.city
                  },
                  function(res2) {
                    console.log("微信登录数据", res2)
                    if (res2.data.code == 1) {
                      wx.setStorageSync('token', res2.data.data.userinfo.token)
                      wx.setStorageSync('openid', res2.data.data.thirdinfo.openid)
                      typeof cb == "function" && cb(2);
                    } else {
                      self.tools.error_tip(res2.data.msg)
                    }
                  }
                )
                // that.wxRequest('/wx/getUserInfoByCode', data, function (res) {
                //   console.log(res);
                //   if (res.data.code == 1) {
                //     save('openid', res.data.data.openId);
                //     save('customerId', res.data.data.customerId);
                //     save('token', res.data.token);
                //     typeof cb == "function" && cb(2);
                //   } else {
                //     save('openid', '');
                //     wx.showToast({
                //       icon: 'none',
                //       title: res.data.msg
                //     });
                //   }
                // })
              }
            })
          } else {
            wx.reLaunch({
              url: '/pages/wx_login/index',
            });
          }
        }
      })
    }
  })
}

function get_id(app, token, encrypteddata, iv, session_key, cb) { //获取群id
  console.log(token)
  console.log(encrypteddata)
  console.log(iv)
  console.log(session_key)
  app.wxRequest('/App/Activity/api', {
    'api_name': 'getOpenGid',
    'token': token,
    'encrypteddata': encrypteddata,
    'iv': iv,
    'session_key': session_key
  }, function(res) {
    console.log('获取id返回的')
    console.log(res)
    var code = JSON.parse(res.data.trim()).code
    res = JSON.parse(JSON.parse(res.data.trim()).data)
    console.log(res.openGId)
    if (code == 1) {
      cb = cb(res.openGId)
    } else {
      cb = cb(false)
    }
  })
}

function get_city(cb) { //获取当前位置详细信息
  wx.getLocation({
    type: 'gcj02',
    success: function(res) {
      var QQMapWX = require('./qqmap-wx-jssdk.min.js')
      var qqMap = new QQMapWX({
        key: 'H3ABZ-W4UK3-RZY3H-3FPJ3-PNLES-L3BZG'
      })
      qqMap.reverseGeocoder({
        location: {
          longitude: res.longitude,
          latitude: res.latitude
        },
        success: function(data) {
          if (typeof cb === "function") cb(data)
        }
      })
    }
  })
}

function goTop() {
  if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，可能会影响您的使用。'
    })
  }
}
/*秒转时间*/
function timeStamp(second_time) {
  var time = parseInt(second_time) + "";
  if (parseInt(second_time) > 60) {
    var second = parseInt(second_time) % 60;
    console.log(second)
    var min = parseInt(second_time / 60);
    second = (second < 10) ? ('0' + second) : second;
    min = (min < 10) ? ('0' + min) : min
    time = min + ":" + second + "";
    if (min > 60) {
      min = parseInt(second_time / 60) % 60;
      var hour = parseInt(parseInt(second_time / 60) / 60);
      // second = (second < 10) ? ('0' + second) : second
      min = (min < 10) ? ('0' + min) : min
      hour = (hour < 10) ? ('0' + hour) : hour
      time = hour + ":" + min + ":" + second + "";

      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        // second = (second < 10) ? ('0' + second) : second
        min = (min < 10) ? ('0' + min) : min
        hour = (hour < 10) ? ('0' + hour) : hour
        time = day + ":" + hour + ":" + min + ":" + second + "";
      }
    }
  } else {

    time = '00:' + (time < 10 ? '0' + time : time);
  }
  return time;
}

function get_prevPage(page) {
  var page = page ? (parseInt(page) + 1) : 2
  var pages = getCurrentPages()
  var prevPage = pages[pages.length - page]
  if (prevPage == undefined || prevPage == null) return 0
  return prevPage
}

function search_key(name) {
  if (this.isNull(name)) return false
  if (wx.getStorageSync('search_key')) {
    let key = wx.getStorageSync('search_key')
    let onOff = false
    key.forEach((item, index) => {
      if (item == name) {
        onOff = true
        return false
      }
    })
    if (onOff) return false
    key.unshift(name)
    wx.setStorage({
      key: "search_key",
      data: key.splice(0, 5) //我只保存五个搜索记录
    })
  } else {
    let key = []
    key.push(name)
    wx.setStorage({
      key: "search_key",
      data: key
    })
  }
}

function error_tip(msg) {
  wx.showModal({
    title: '提示',
    confirmColor: '#ec823d',
    content: msg ? msg : '请求出错，请联系技术人员',
    showCancel: false
  })
}

module.exports = {
  checkPhone: checkMobileAndTel, //手机验证
  trim: trim, //去左右空格
  isNull: checkNoNull, //判断是否为空
  getTime: formatTime,
  getLocalTime: getLocalTime,
  toast: toast,
  getUrl: getUrlParam,
  wx_login: wx_login,
  get_id: get_id,
  get_city: get_city, //获取当前位置详细信息
  goTop: goTop, //回到顶部，
  get_prevPage: get_prevPage,
  search_key: search_key, //保存搜索关键字
  format: format,
  timeStamp: timeStamp,
  error_tip: error_tip //请求接口错误提示
}