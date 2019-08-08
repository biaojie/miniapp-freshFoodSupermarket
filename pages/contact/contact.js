var CONFIG = require('../../utils/config.js')
var WxParse = require('../../utils/wxParse/wxParse.js');

Page({
  data: {
    markers: [{
      baseUrl: CONFIG.API_URL.URL,
      id: 0,
      latitude: 22.884171,
      longitude: 108.432105,
      width: 50,
      height: 50
    }]
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: CONFIG.API_URL.contact,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.statusCode == 200 ) {
          var data = res.data;
          that.setData({page: data});
          WxParse.wxParse('content', 'html', data.content, that, 25)
        }
      }
    })
  },
  onShareAppMessage: function () {
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/contact/contact'
    }
  }
})


