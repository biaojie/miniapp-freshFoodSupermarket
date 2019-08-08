// pages/member/member/open/open.js
const CONFIG = require('../../../utils/config.js')
var qqmapsdk;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  
  pay: function (e) {
    wx.navigateTo({
      url: '/pages/order/payment/payment'
    });
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    }
    
  }, 
})