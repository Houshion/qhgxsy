const app = getApp()
Page({
  data: {

  },

  onLoad: function(e) {
    let self = this

  },

  onShow: function() {
    let self = this

  },

  wx_loginByButton: function(e) {
    let self = this
    wx.showLoading({
      title: '正在授权'
    })
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      app.tools.wx_login(function (flag) {
        if (flag == 2) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }, app)
    }else{
      wx.hideLoading();
      wx.showToast({
        title: '授权失败',
        icon:'none'
      })
    }
  }
})