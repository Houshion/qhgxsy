const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questList: [],
    macno: '', //扫码编号
    lispic: [],
    description: '',
    lispic_path: [],
    isChecked: 0,
    question: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  choseType: function(e) {
    let self = this;
    self.setData({
      isChecked: e.target.dataset.index,
      question: e.target.dataset.name
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    app.wxRequest(
      '', {
        HTTP_API: 'vv/repairs/api/index/repairsQuestions',
        token: wx.getStorageSync('token')
      },
      function(res) {
        if (res.data.code == 1) {
          self.setData({
            questList: res.data.data,
            question: res.data.data[0]
          })
        } else {
          app.tools.error_tip(res.data.msg)
        }
      }
    )
  },
  indexpic_delete(e) { //删除图片
    let lispic = this.data.lispic;
    let lispic_path = this.data.lispic_path;
    lispic.splice(e.currentTarget.dataset.index, 1);
    lispic_path.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      lispic: lispic,
      lispic_path: lispic_path
    });
  },
  choice(e) { //上传图片
    let self = this
    app.uploadFile(1, function(flag, idx, msg, data) {
      if (flag == 1) {
        console.log(msg)
        let res = msg.tempFilePaths
        if (self.data.lispic.length < 5) {
          self.setData({
            lispic: self.data.lispic.concat(res)
          })
        } else {
          wx.showModal({
            title: '提示',
            confirmColor: '#e9c426',
            content: '最多只能上传5张图片...',
            showCancel: false
          })
          wx.setStorageSync('allowPicNum', 0)
          return false
        }
      } else if (flag == 2) {
        console.log(msg)
        if (self.data.lispic_path.length < 5) {
          self.data.lispic_path.push(msg.url)
        }
        console.log(self.data.lispic_path)
      }
    }, {}, '', 5 - self.data.lispic_path.length)
  },

  scan: function() {
    let self = this
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果', res)
        let macno = res.result
        // let macno = app.tools.getUrl("url", scan_result)
        console.log(macno)
        self.setData({
          macno: macno
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  submit: function() {
    let self = this;
    if (self.data.macno == '') {
      wx.showToast({
        title: '请输入设备编码',
        icon: 'none'
      })
    } else if (self.data.description == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '提交中',
      })
      let data = {
        HTTP_API: 'vv/repairs/api/index/submitrepairs',
        token: wx.getStorageSync('token'),
        question: self.data.question,
        content: self.data.description,
        macno: self.data.macno,
        pic: self.data.lispic_path.join(','),
      }
      app.wxRequest(
        '', data,
        function(res) {
          if (res.data.code == 1) {
            wx.hideLoading();
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.switchTab({
                url: "/pages/center/index"
              })
            }, 800)
          } else {
            app.tools.error_tip(res.data.msg)
          }
        }
      )
    }
  },
  // 问题描述详情
  checkText: function(e) {
    let self = this
    self.setData({
      description: e.detail.value,
    })
  },
  macnoInput: function(e) {
    this.setData({
      macno: e.detail.value
    });
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