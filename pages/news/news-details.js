var CONFIG = require('../../utils/config.js')
var WxParse = require('../../utils/wxParse/wxParse.js');

var app = getApp();
Page({
  data:{
    uid:''
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      uid: options.id
    })
    wx.request({
      url: CONFIG.API_URL.data_contact,
      method: 'GET',
      data: { id: options.id},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.statusCode == 200 ) {        
          var data = res.data;
        
          that.setData({ news: data})
          WxParse.wxParse('content', 'html', data.content, that, 25)
        } else {
          
        }
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onShareAppMessage: function () {
    var that=this;
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/news/news-details?id=' + that.data.uid
    }
  }
})
