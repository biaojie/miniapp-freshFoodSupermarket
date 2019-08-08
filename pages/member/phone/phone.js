const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tel:'',
      verifyCodeTime: '获取验证码',
      buttonDisable: false,
      code:'',
      inputImgCode:'',
      mobile:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userinfo = app.globalData.userInfo;
    wx.request({
      url: CONFIG.API_URL.mobile,
      data: { openid: userinfo.openId},
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.data.success == 1){
          that.setData({
            mobile: res.data.message
          })
        }
      }
      })
  },
/*获取输入的手机号码*/
  inputPhone:function(e){
    var that=this;
    that.setData({
      tel: e.detail.value
    })
  },
/*获取验证码*/
  tel_sms:function(){
    var that=this;
    var userinfo = app.globalData.userInfo;
    var tel = that.data.tel;
    var regMobile = /^1\d{10}$/;

    if (!regMobile.test(tel)) {
      wx.showToast({
        icon: 'loading',
        title: '手机号有误！'
      })
      return false;
    }
    if (tel == that.data.mobile) {
      wx.showToast({
        icon: 'loading',
        title: '手机号码已绑定'
      })
      return false;
    }
    if (that.data.buttonDisable) return false;
    wx.request({
      url: CONFIG.API_URL.tel_sms,
      data: { openid: userinfo.openId, mobile: tel },
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.data.success == '1') {
          that.setData({
            code: res.data.code
          })
          var c = 120;
          var intervalId = setInterval(function () {
            c = c - 1;
            that.setData({
              verifyCodeTime: c + 's',
              buttonDisable: true
            })
            if (c == 0) {
              clearInterval(intervalId);
              that.setData({
                verifyCodeTime: '获取验证码',
                buttonDisable: false
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            title: '获取验证码失败',
            icon: 'loading',
            duration: 1000
          })
        }
      },
      fail: function (error) { }
    })
  },
  inputImgCode:function(e){
    var that = this;
    that.setData({
      inputImgCode: e.detail.value
    })
  },
  button:function(){
    var userinfo = app.globalData.userInfo;
    var that=this;
    if (that.data.tel == '') {
      wx.showToast({
        icon: 'loading',
        title: '手机号不能为空'
      })
      return false;
    }
    if (that.data.inputImgCode == '') {
      wx.showToast({
        icon: 'loading',
        title: '验证码不能为空'
      })
      return false;
    }
    if (that.data.inputImgCode != that.data.code ) {
      wx.showToast({
        icon: 'loading',
        title: '验证码错误'
      })
      return false;
    }
    wx.request({
      url: CONFIG.API_URL.tel_user,
      data: {openid: userinfo.openId, mobile: that.data.tel},
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.data.success == '1'){
          wx.showToast({
            title: '手机绑定成功',
            icon: 'loading',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              url: '/pages/member/index/index',
            })
          }, 1000)
        }else{
          wx.showToast({
            title: '手机绑定失败',
            icon: 'loading',
            duration: 1000
          })
        }
      }

    })
  }



})