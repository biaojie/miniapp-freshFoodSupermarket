const CONFIG = require('../../../utils/config.js')

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo == null) {
      this.login();
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    
    var userinfo = app.globalData.userInfo;
    wx.request({
      url: CONFIG.API_URL.score,
      data: { openid: userinfo.openId },
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        that.setData({
          score: res.data.score
        })
      }
    })

  },

  onShow: function () {
    var that = this;
    // 获得当前登录用户
    that.setData({
      userInfo: that.data.userInfo
    });
    console.log(that.data.userInfo)

  },
  onShareAppMessage: function () {
  
  },
  open: function(){
    wx.navigateTo({
      url: '/pages/member/member/open/open',
    })
  }
})