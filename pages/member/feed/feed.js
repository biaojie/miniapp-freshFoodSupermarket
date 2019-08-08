const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
     });
  },
//意见反馈添加
add:function(e){
  var that=this;
  var openId = that.data.userInfo.openId;
  var content = e.detail.value.content;
  var contact = e.detail.value.contact;
  console.log(openId);
  wx.request({
    url: CONFIG.API_URL.feed_add,
    data: {
      openId: openId,
      content: content,
      contact: contact
    },
    success: function (res) {
      var data = res.data
      if (data.status == 1) {
        that.showCartToast()
      }
    }
  })
},
showCartToast: function () {
  wx.showToast({
    title: '意见已反馈',
    icon: 'success',
    duration: 1000
  });
  setTimeout(function () {
    wx.navigateBack({
      url: '/pages/member/help/help',
    })
  }, 1000)
 
},
onShareAppMessage: function () {
  //分享设置
  return {
    title: '民生家园',
    desc: '民生家园微信小程序',
    path: '/pages/member/feed/feed'
  }
},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  Authentication_2:function(){
    wx.navigateTo({
      url: '../authentication_2/authentication_2'
    })
  }


})