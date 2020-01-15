Page({
    goTo: function (e) {
        const _this = this;
        console.log(e)
        let url = e.currentTarget.dataset.url;
        // switch (type) {
        //     case "1":
        //         url = '/pages/profile/index'
        //         break;
        //     case "2":
        //         url = '/pages/news/index'
        //         break;
        //     case "3":
        //         url = '/pages/map/index'
        //         break;
        //     case "4":
        //         url = '/pages/question/index'
        //         break;
        //     case "5":
        //         url = '/pages/center/index'
        //         break;
        //     case "6":
        //         // url = '/pages/profile/index'
        //         break;
        // }
        if (url == 6) {
            wx.showToast({
                title: '开发中,敬请期待......',
                icon: 'none',
                duration: 2000
            });
            return false;
        } else {
            wx.navigateTo({
                url: url
            })
        }

    }
})