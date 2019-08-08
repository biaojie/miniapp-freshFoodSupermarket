const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
  data: {
    numbers: "",
    list:[]
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: CONFIG.API_URL.list_help,
      method: 'GET',
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

  help: function () {
    wx.navigateTo({
      url: '/pages/member/help/help',
    })
  },
  addd: function (e) {
    var id = e;
    var that = this;
    that.satData({
      id: 42
    })
  },
  feed: function () {
    wx.navigateTo({
      url: '/pages/member/feed/feed',
    })
  },
  details:function(e){
    var id = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/news/news-details?id=' + id
    })
  },
  onShareAppMessage: function () {
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/member/help/help'
    }
  }
})
