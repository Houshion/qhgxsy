var app = getApp()
// pages/changePhone/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    code: '',
    logo: '',
    codeText: '获取验证码',
    sendStatus: false,
    on_off: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getCode: function() {
    let mobile = this.data.mobile;
    let self = this;
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号码',
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
      self.setData({
        sendStatus: true
      })
      let num = 60
      self.setData({
        codeText: num + ' s'
      })
      let timer = setInterval(function() {
        num = num - 1
        self.setData({
          codeText: num + ' s'
        })
        if (num == 0) {
          clearInterval(timer)
          self.setData({
            codeText: '重新发送',
            sendStatus: false
          })
        }
      }, 1000)
      app.wxRequest(
        '', {
          HTTP_API: 'vv/sms/api/index/send',
          platform: 'ztsms',
          mobile: self.data.mobile,
          event: 'changemobile'
        },
        function(res) {
          console.log('短信验证数据', res)
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
  // 双向绑定mobile
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },
  // 绑定手机号码
  submit() {
    let mobile = this.data.mobile;
    let code = this.data.code;
    let self = this;
    console.log(code)
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    } else if (!app.tools.checkPhone(mobile)) {
      wx.showToast({
        title: '手机号码格式有误',
        icon: 'none'
      })
    } else if (code=='') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '发送中'
      })
      self.setData({
        sendStatus: true
      })
      let num = 60
      self.setData({
        codeText: num + ' s'
      })
      let timer = setInterval(function() {
        num = num - 1
        self.setData({
          codeText: num + ' s'
        })
        if (num == 0) {
          clearInterval(timer)
          self.setData({
            codeText: '重新发送',
            sendStatus: false
          })
        }
      }, 1000)
      app.wxRequest(
        '', {
          HTTP_API: 'vv/usercenter/api/user/changemobile',
          mobile: self.data.mobile,
          captcha: self.data.code,
          token: wx.getStorageSync('token'),
        },
        function(res) {
          console.log('绑定手机号', res)
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
    let self=this;
    app.wxRequest( //获取logo
      '', {
        HTTP_API: 'vv/advert/api/index/getAdvertByKey',
        keyname: 'telephone'
      },
      function (res) {
        console.log(res.data.data)
        let logo = res.data.data[1].link
        console.log(logo)
        if (res.data.code == 1) {
          self.setData({
            logo:logo
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