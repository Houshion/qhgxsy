const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0,
    status_name: '使用中',
    isLoop: 0, //轮询接口
    isShow: false
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function(options) {
    console.log(options)
    let self = this;
    self.setData({
      oid: options.id,
      macno: options.macno
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let timer1 = null;
    this.datacTime = 30;
    let self = this;
    timer1 = setInterval(() => {
      cTime--
      self.init()
      console.log(cTime)
      if (self.data.isLoop != 0) {
        clearInterval(timer1);
      }
      if (cTime <= 0 && self.data.isLoop == 0) {
        clearInterval(timer1);
        setTimeout(() => {
          wx.showToast({
            title: '开启设备失败，金额原路退回',
            icon: 'none'
          })
        }, 800)
        wx.navigateTo({
          url: '/pages/scan/index',
        })
      }
    }, 1000)
  },
  init() {
    let self = this;
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest( //倒计时
      '', {
        HTTP_API: 'vv/order/api/index/orderStatus',
        token: wx.getStorageSync('token'),
        oid: self.data.oid,
        macno: self.data.macno
      },
      function(res) {
        console.log(res.data.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          if (res.data.data.status == 1) {
            let time = res.data.data.remaintime;
            let timer = null;
            timer = setInterval(() => {
              time--
              self.setData({
                time: app.tools.timeStamp(time),
                status_name: '使用中',
                isShow: 1,
                isLoop: 1
              })
              if (time <= 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            self.setData({
              time: '00:00',
              status_name: '结束使用',
              isShow: 1,
              isLoop: 0
            })
          }
        } else {
          app.tools.error_tip(res.data.msg);
          self.setData({
            isLoop: 2
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/scan/index',
            })
          }, 800)
        }
      }
    )
  },
  coutDown: function() {
    let self = this;
    let timer = null;
    let time = self.data.time
    timer = setInterval(() => {
      time--
      self.setData({
        time: app.tools.timeStamp(time),
        isShow: 1
      })
      if (time <= 0) {
        clearInterval(timer)
      }
    }, 1000)

  },
  /**
   * 结束使用
   */
  endUse: function() {
    if (this.data.isLoop == 0) {
      wx.showLoading({
        title: '加载中，请稍后',
      })
    } else {
      wx.hideLoading();
      this.outUse();
    }
  },
  outUse: function() {
    let self = this;
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(
      '', {
        HTTP_API: 'vv/order/api/index/stopOrder',
        token: wx.getStorageSync('token'),
        oid: self.data.oid,
      },
      function(res) {
        console.log(res.data.data);
        if (res.data.code == 1) {
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          setTimeout(() => {
            self.outUse();
          }, 800);
        }
      }
    )
  },
  /**
   * 返回首页
   */
  backHome: function() {
    let self = this;
    wx.switchTab({
      url: '/pages/index/index',
    })
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