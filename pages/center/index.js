const app = getApp()
Page({
  data: {
    bg_center: '../../image/image1.png',
  },
  onShow: function() {
    let self = this;
    app.wxRequest( //获取个人中心信息
      '', {
        HTTP_API: 'vv/usercenter/api/user/profile',
        token: wx.getStorageSync('token'),
      },
      function(res) {
        if (res.data.code == 1) {
          console.log(res.data.data.userinfo)
          self.setData({
            avatar: res.data.data.userinfo.avatar,
            nickname: res.data.data.userinfo.nickname,
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
    app.wxRequest( //获取分享的信息
      '', {
        HTTP_API: 'vv/help/api/index/getArticleByKeyName',
        keyname: 'share',
      },
      function(res) {
        if (res.data.code == 1) {
          let data = res.data.data;
          self.setData({
            pic: data.pic,
            title: data.title,
            video_url: data.video_url,
            content: data.content
          })
          console.log(self.data.pic)
          console.log(self.data.title)
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
  },
  onShareAppMessage: function(res) {
    let self = this
    let use_time = Date.parse(new Date()) / 1000
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: self.data.title,
      path: "/pages/wx_login/index",
      imageUrl: self.data.pic
    }
  },
  share: function() {

  }
})