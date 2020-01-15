const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: 0,
    deposit: 0,
    macno: '',
    tip: 1,
    list: []
  },

  // 选择套餐
  choseMeal: function(e) {
    let self = this;
    self.setData({
      isChecked: e.target.dataset.index
    })
  },

  onLoad: function(options) {
    let self = this;
    let macno = options.macno || decodeURIComponent(JSON.parse(JSON.stringify(options)).q).split('=')[1] || ''
    self.setData({
      macno: macno
    })
  },

  onShow: function() {
    let self = this;
    setTimeout(() => {
      self.setData({
        tip: 0
      })
    }, 3000)
    app.wxRequest( //押金
      '', {
        HTTP_API: 'vv/money/api/index/getDeposit',
        token: wx.getStorageSync('token')
      },
      function(res) {
        console.log(res.data.data)
        if (res.data.code == 1) {
          wx.hideLoading();
          self.setData({
            deposit: res.data.data.deposit
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
    app.wxRequest( //轮播图
      '', {
        HTTP_API: 'vv/advert/api/index/getAdvertByKey',
        keyname: 'taocan'
      },
      function(res) {
        console.log(res.data.data)
        if (res.data.code == 1) {
          self.setData({
            swiperImg: res.data.data
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
    app.wxRequest( //列表
      '', {
        HTTP_API: 'vv/taocan/api/index/allTaocan',
        token: wx.getStorageSync('token'),
        macno: self.data.macno
      },
      function(res) {
        console.log(res.data.data)
        if (res.data.code == 1) {
          if (res.data.data.status == 3) { //使用中
            let macno = self.data.macno;
            let oid = res.data.data.oid;
            wx.navigateTo({
              url: '/pages/using/index?macno=' + macno + "&id=" + oid
            })
          }
          if (Array(res.data.data).length > 0) {
            self.setData({
              noEmpty: 1
            })
          }
          self.setData({
            list: res.data.data[0].list,
            isChecked: res.data.data[0].list[0].id
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
  },
  tipHide: function() {
    let self = this;
    self.setData({
      tip: 0
    })
  },

  /**
   * 确定套餐
   */
  confirmOrder: function() {
    let self = this;

    wx.showLoading({
      title: '加载中...',
    })
    app.wxRequest( //下单接口
      '', {
        HTTP_API: 'vv/order/api/index/qhMakeOrder',
        token: wx.getStorageSync('token'),
        taocan: self.data.isChecked,
        macno: self.data.macno
      },
      function(res) {
        console.log(res.data.data)
        wx.hideLoading();
        if (res.data.code == 1) {
          let multipayno = [];
          let money = res.data.data.money;
          let oid = res.data.data.oid;
          multipayno.push(res.data.data.paylog)
          if (res.data.data.deposit) {
            multipayno.push(res.data.data.deposit)
          }
          self.setData({
            multipayno: multipayno.join(','),
            money: money,
            oid: oid
          })
          app.wxRequest( //支付接口
            '', {
              HTTP_API: 'vv/multipay/api/index/makePay',
              multipayno: self.data.multipayno,
              money: self.data.money,
              pay_type: 'weixin'
            },
            function(res) {
              console.log(res.data.data)
              let trade_no = res.data.data.paylog
              self.setData({
                trade_no: trade_no
              })
              if (res.data.code == 1) {
                //获取微信支付参数
                app.wxRequest(
                  '', {
                    HTTP_API: 'vv/weixinpay/api/index/pay',
                    openid: wx.getStorageSync('openid'),
                    token: wx.getStorageSync('token'),
                    money: self.data.money,
                    trade_no: self.data.trade_no,
                    trade_type: 'JSAPP'
                  },
                  function(res2) {
                    console.log(res2.data.data)
                    if (res2.data.code == 1) {
                      wx.requestPayment({
                        'timeStamp': res2.data.data.timeStamp,
                        'nonceStr': res2.data.data.nonceStr,
                        'package': res2.data.data.package,
                        'signType': res2.data.data.signType,
                        'paySign': res2.data.data.paySign,
                        'success': function(res3) {
                          console.log('支付成功')
                          self.setData({
                            mask: true,
                            all_money: self.data.all_money * 1 + self.data.total_money * 1
                          })

                          setTimeout(function() {
                            wx.navigateTo({
                              url: '/pages/using/index?id=' + self.data.oid + '&macno=' + self.data.macno
                            })
                          }, 2000)
                        },
                        'fail': function(res3) {
                          console.log('支付失败')
                        }
                      })

                    } else {
                      app.tools.error_tip(res.data.msg)
                    }
                  }
                )

              } else {
                app.tools.error_tip(res.data.msg)
              }
            }
          )

        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
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