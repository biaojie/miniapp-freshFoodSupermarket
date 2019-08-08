const CONFIG = require('../../../utils/config.js')
var qqmapsdk;
var app = getApp()
Page({
  data:{
   numbers:"",
   score:''
  },
  onLoad:function(){
    var that=this;
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
	navigateToAddress: function () {
    if (app.globalData.userInfo == null) {
      this.login();
    } else {
		wx.navigateTo({
			url: '../../address/list/list'
		});
    }
	},
  login: function () {
    var that = this;
    // 显示提示弹窗

    wx.openSetting({
      success: function (data) {
        wx.login({
          success: function (r) {
            var code = r.code;//登录凭证
            if (code) {
              //2、调用获取用户信息接口
              wx.getUserInfo({
                success: function (res) {
                  //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                  wx.request({
                    url: CONFIG.API_URL.getSession,//自己的服务接口地址
                    method: 'post',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      code: code
                    },
                    success: function (data) {

                      //4.解密成功后 获取自己服务器返回的结果
                      if (data.data.status == 1) {
                        var userInfo_ = data.data.userInfo;
                        that.setData({
                          userInfo:userInfo_
                        });
                        app.globalData.userInfo = userInfo_;
                      } else {
                        console.log('解密失败')
                      }

                    },
                    fail: function () {
                      console.log('系统错误')
                    }
                  })
                },
                fail: function () {
                  console.log('获取用户信息失败');
                }
              })

            } else {
              console.log('获取用户登录态失败！' + r.errMsg)
            }
          },
          fail: function () {
            console.log('登陆失败')
          }
        })
      }
    });

  },
 
	navigateToOrder: function (e) {
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      var status = e.currentTarget.dataset.status
      wx.navigateTo({
        url: '../../order/list/list?status=' + status
      });
    }
	
	},
	logout: function () {
		if (AV.User.current()) {
			AV.User.logOut();
			wx.showToast({
				'title': '退出成功'
			});
		} else {
			wx.showToast({
				'title': '请先登录'
			});
		}
	},
	onShow: function () {
		var that = this;
		// 获得当前登录用户
      that.setData({
        userInfo: that.data.userInfo
      });
      console.log(that.data.userInfo)


	},
	chooseImage: function () {
  /**上传头像 */
		var that = this;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePath = res.tempFilePaths[0];
				new AV.File('file-name', {
					blob: {
						uri: tempFilePath,
					},
				}).save().then(
				// file => console.log(file.url())
					function(file) {
						// 上传成功后，将所上传的头像设置更新到页面<image>中
						var userInfo = that.data.userInfo;
						userInfo.avatarUrl = file.url();
						that.setData({
							userInfo, userInfo
						});
					}
				).catch(console.error);
			}
		})
	},
	navigateToAboutus: function () {
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      wx.navigateTo({
        url: '/pages/member/aboutus/aboutus'
      });
    }
	
	},
	navigateToDonate: function () {
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      wx.navigateTo({
        url: '/pages/member/donate/donate'
      });
    }
	
	},
	navigateToShare: function () {
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      wx.navigateTo({
        url: '/pages/member/share/share'
      });
    }
		
	},
  navigateTojifen:function(){
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      wx.navigateTo({
        url: '/pages/order/list/jifen_order_list'
      }); 
    }
   
  },
  collect: function () {
    if (app.globalData.userInfo == null) {
      this.login();
    } else {
      wx.navigateTo({
        url: '/pages/member/collect/collect'
      });
    }
  },
  sign_in: function (){
    wx.navigateTo({
      url: '/pages/member/Sign-in/Sign-in',
    })
  },
  member: function(){
    wx.navigateTo({
      url: '/pages/member/member/member',
    })
  },
  red_envelope: function(){
    wx.navigateTo({
      url: '/pages/member/red-envelope/red-envelope',
    })
  },
  phone:function(){
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
    wx.navigateTo({
      url: '/pages/member/phone/phone',
      })
    }
  },
  help:function(){
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      wx.navigateTo({
        url: '/pages/member/help/help',
      })
    }
   
  },
  feed:function(){
    if (app.globalData.userInfo == null) {
      this.login();
    }else{
      wx.navigateTo({
        url: '/pages/member/feed/feed',
      })
    }
 
  },
  onShareAppMessage: function () {
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/member/index/index'
    }
  },

})