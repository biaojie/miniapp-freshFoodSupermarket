const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
	data: {
		orderId: ''
	},
	onLoad: function (options) {
    console.log(options);
		var orderId = options.orderId;
		var totalFee = options.totalFee;
		this.setData({
			orderId: orderId,
			totalFee: totalFee
		})
	},
  submitInfo: function (options) {
   
		var that = this;
		//统一下单接口对接
		wx.request({
      url: CONFIG.API_URL.WeiaPay,
			data: {
        openId: app.globalData.userInfo.openId,
        body: '民生家园',
				tradeNo: that.data.orderId,
				totalFee: parseFloat(that.data.totalFee) * 100
			},
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (response) {
				// 发起支付
				wx.requestPayment({
					'timeStamp': response.data.timeStamp,
					'nonceStr': response.data.nonceStr,
					'package': response.data.package,
					'signType': 'MD5',
					'paySign': response.data.paySign,
					'success':function(res){
            wx.showLoading({
              title: '支付处理中',
            })
            wx.request({
              url: CONFIG.API_URL.SetOrderStatus,
              data:{
                openId: app.globalData.userInfo.openId,
                tradeNo: that.data.orderId,
                prepay_id: response.data.package,
                form_id: options.detail.formId
              },
              success(res1){
                wx.hideLoading()
                wx.switchTab({
                  url: "/pages/index/index",
                })
              }
            })
					}
				});
			}
		});
	}
})