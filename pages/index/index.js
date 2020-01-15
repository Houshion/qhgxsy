var WxParse = require('../wxParse/wxParse.js')
const app = getApp()
Page({
  data: {
    swiperImg: [],
    noEmpty: false,
    isLoad: 0,
    currentSwiper: 0,
    autoplay: true,
    newsList: []
  },
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onShow: function() {
    let self = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {

      app.wxRequest( //轮播图
        '', {
          HTTP_API: 'vv/advert/api/index/getAdvertByKey',
          keyname: 'banner'
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
          HTTP_API: 'vv/help/api/index/getArticleByTypeKeyName',
          keyname: 'information',
          token: wx.getStorageSync('token')
        },
        function(res) {
          console.log(res.data.data)
          if (res.data.code == 1) {
            wx.hideLoading()
            if (Array(res.data.data).length > 0) {
              self.setData({
                noEmpty: 1,
                isLoad: 1
              })
            }
            let list = res.data.data.list
            list.forEach((item, index) => {
              item.content = WxParse.wxParse('article', 'html', item.content, self, 5)
              item.pic = item.pic.split(',')[0]
              console.log(item.pic.split(',')[0])
            })
            self.setData({
              newsList: list
            })
          } else {
            app.tools.error_tip(res.data.msg)
          }
        }
      )
    }, 800)
  },
})