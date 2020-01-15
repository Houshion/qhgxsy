const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onOff: false,
    isScanner: 1
  },

  onShow: function() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    if (this.data.isScanner == 1) {
      this.scan()
    }

  },
  onHide() {
    this.setData({
      isScanner: 0
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  scan: function() {
    let self = this;
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果', res)
        // let macno = res.result
        let macno = app.tools.getUrl("macno", res.result)
        console.log(macno)
        app.wxRequest( //列表
          '', {
            HTTP_API: 'vv/taocan/api/index/allTaocan',
            token: wx.getStorageSync('token'),
            macno: macno
          },
          function(res) {
            console.log(res.data.data)
            if (res.data.code == 1) {
              if (res.data.data.status == 1) { //下单页面
                wx.navigateTo({
                  url: '/pages/choose/index?macno=' + macno
                })
              } else if (res.data.data.status == 3) { //使用中
                let oid = res.data.data.oid;
                wx.navigateTo({
                  url: '/pages/using/index?macno=' + macno + "&id=" + oid
                })
              } else {
                wx.showLoading({
                  title: res.data.msg,
                })
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }, 800)
              }
            } else {
              app.tools.error_tip(res.data.msg)
            }
          }
        )

      }
    })
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