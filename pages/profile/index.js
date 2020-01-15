var app = getApp()
Page({
  data: {
    arraytype: ['拍照', '从相册选择'],
    sourceType: ['camera', 'album'],
    index: 0,
  },

  onLoad: function(options) {
    var self = this

  },

  onReady: function() {

  },

  onShow: function() {
    var self = this
    if (app.globalData.userID != '') {
      app.wxRequest(
        '', {
          HTTP_API: 'vv/usercenter/api/user/profile',
          token: wx.getStorageSync('token'),
        },
        function(res) {
          console.log('个人信息数据', res)
          if (res.data.code==1) {
            self.setData({
              avatar: res.data.data.userinfo.avatar,
              nickname: res.data.data.userinfo.nickname,
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

  uploadimg: function(e) {
    var that = this;
    var index = e.detail.value;
    var type = e.currentTarget.dataset.type;
    var requestUrl = app.globalData.dlcurl + 'upload';
    if (requestUrl.indexOf('?') == -1) {
      requestUrl += '?';
    } else {
      requestUrl += '&';
    }
    requestUrl += 'userid=' + app.globalData.userID + '&sign=' + app.globalData.userSign + '&timestamp=' + app.globalData.userTimeStamp;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [that.data.sourceType[index]], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中...'
        });
        //上传图片
        wx.uploadFile({
          url: requestUrl,
          filePath: tempFilePaths[0],
          header: {
            'Content-Type': 'multipart/form-data'
          },
          name: 'file',
          formData: {
            upname: 'file',
            upfile: 'file'
          },
          success: function(res) {
            console.log('头像上传数据', res);
            var data = res.data;
            data = data.trim();
            data = JSON.parse(data);
            that.setData({
              avatar: (app.globalData.baseurl + data.data.filename) || ''
            })

            app.wxRequest(
              'edit', {
                avatar: data.data.filename
              },
              function(res) {
                console.log('头像修改数据', res)
                wx.hideLoading()
                if (res.data.msg == 'success') {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    confirmColor: '#ec823d',
                    content: res.data.tip ? res.data.tip : '请求失败，请刷新',
                    showCancel: false
                  })
                }
              },
              function(err) {
                wx.hideLoading()
                console.log(JSON.stringify(err))
              }
            )
            wx.showToast({
              title: '修改成功!',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  }
})