const app = getApp()
// map.js
Page({
  data: {
    lat: '',
    lng: '',
    listShow: 0,
    current_location: {},
    list: []
  },
  onShow: function() {
    let self = this;
    wx.getLocation({
      success: res => {
        console.log(res);
        var markers = [];
        markers.push({
          id: -1,
          latitude: res.latitude,
          longitude: res.longitude,
          width: 21,
          height: 38,
          iconPath: "/image/location.png",
          title: "",
          anchor: {
            x: .5,
            y: .5
          }
        });
        self.setData({
          location: res,
          lat: res.latitude,
          lng: res.longitude,
          markers: markers
        })
        app.wxRequest(
          '', {
            HTTP_API: 'vv/station/api/index/submit_search',
            lat: self.data.lng,
            lng: self.data.lng
          },
          function(res) {
            if (res.data.code == 1) {
              console.log(res.data.data)
              res.data.data.list.forEach((item, index) => {
                markers.push({
                  iconPath: '/image/i_marker.png',
                  id: index,
                  latitude: item.lat,
                  longitude: item.lng,
                  title: item.title,
                  address: item.address,
                  width: 40,
                  height: 43
                })
              })

              self.setData({
                markers: markers
              })
            } else {
              app.tools.error_tip(res.data.msg)
            }
          }
        )
      },
    })

  },
  regionchange(e) {
    console.log(e.type)
  },
  //点击merkers
  markertap(e) {
    // console.log(e);
    let self = this;
    self.data.markers.forEach((item, index) => {
      if (item.id == e.markerId) {
        self.setData({
          current_location: item,
          listShow: true
        })
        return false
      }
    })
    console.log(self.data.current_location)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  setNavigation(e) {
    let self=this;
    console.log(self.data.current_location)
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function(res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: self.data.current_location.latitude*1, //要去的纬度-地址
          longitude: self.data.current_location.longitude*1, //要去的经度-地址
          name: self.data.current_location.title,
          address: self.data.current_location.address
        })
      }
    })
  }
})