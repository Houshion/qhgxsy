const app = getApp()
Page({
  data: {
    aboutImg: '',
    content: '',
    swiperImg: [],
  },
  onShow: function() {
    let self = this;
    app.wxRequest(
      '', {
        HTTP_API: 'vv/companyinfo/api/index/getInfo',
      },
      function (res) {
        if (res.data.code == 1) {
          console.log(res.data.data)
          self.setData({
            aboutImg: res.data.data.company_logo,
            content: res.data.data.company_desc,
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
  }
})