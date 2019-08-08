
const CONFIG = require('../../utils/config.js')
const app = getApp()

Page({
    data: {
        baseUrl: CONFIG.API_URL.URL,
        banner:0,
        list:[]
    },
    onLoad: function(){
      var that=this;
      wx.request({
        url: CONFIG.API_URL.list_contact,
        method:'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res);
          that.setData({
            list: res.data
          })
        }
      })
    },
    showGoods: function (e) {
     var id=e.currentTarget.dataset.uid;
     wx.navigateTo({
       url: '/pages/news/news-details?id=' + id
     })
    },
    onShareAppMessage: function () {
      //分享设置
      return {
        title: '民生家园',
        desc: '民生家园微信小程序',
        path: '/pages/news/news'
      }
    }
})