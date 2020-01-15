var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init();
  },
  init() {
    var self = this
    if (app.globalData.userID != '') {
      app.wxRequest(
        '', {
          HTTP_API: 'vv/usercenter/api/user/myWallet',
          token: wx.getStorageSync('token'),
        },
        function(res) {
          console.log('我的押金数据', res.data.data)
          if (res.data.code == 1) {
            self.setData({
              uDeposit: res.data.data.uDeposit,
            })
          } else {
            app.globalData.userID = ''
            self.setData({
              userID: ''
            })
            wx.setStorageSync('userID', '')
          }
        },
        function(err) {
          console.log(JSON.stringify(err))
        }
      )
    }
  },
  returnDeposit() { //退押金
    let self = this;
    if (this.data.uDeposit > 0) {
      app.wxRequest(
        '', {
          HTTP_API: 'vv/weixinpay/api/index/depositBack',
          token: wx.getStorageSync('token')
        },
        function(res) {
          console.log(res.data.data)
          wx.hideLoading()
          if (res.data.code == 1) {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 800)
          } else {
            self.setData({
              sendStatus: false
            })
            app.tools.error_tip(res.data.msg)
          }
        }
      )
    } else {
      wx.showToast({
        title: '请先交押金再操作',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})