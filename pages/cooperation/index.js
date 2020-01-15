var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  nameInput(e) {
    this.setData({
      nickname: e.detail.value
    });
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  submit: function() {
    let self = this;
    let nickname = this.data.nickname;
    let mobile = this.data.mobile;
    if (nickname == '') {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      })
    } else if (mobile == '') {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
    } else if (!app.tools.checkPhone(mobile)) {
      wx.showToast({
        title: '手机号码格式有误',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '发送中'
      })
      app.wxRequest(
        '', {
          HTTP_API: 'vv/jiameng/api/index/apply',
          name: self.data.nickname,
          mobile: self.data.mobile,
          token: wx.getStorageSync('token')
        },
        function(res) {
          console.log(res.data.data)
          wx.hideLoading()
          if (res.data.code == 1) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            self.setData({
              sendStatus: false
            })
            app.tools.error_tip(res.data.msg)
          }
        }
      )
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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