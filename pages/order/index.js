const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: [],
    isShow: false,
    is_empty: null
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
    let self = this;
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(
      '', {
        HTTP_API: 'vv/order/api/index/getOrderList',
        token: wx.getStorageSync('token')
      },
      function(res) {
        if (res.data.code == 1) {
          wx.hideLoading();
          self.setData({
            orderArray: res.data.data.list,
            isShow:1
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )

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