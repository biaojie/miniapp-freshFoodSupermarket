const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
	data: {
    baseUrl: CONFIG.API_URL.URL,
		orders: [],
	},
	onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.goods_id
    })
	},
	onShow: function() {
		this.reloadData();
	},
  	reloadData: function () {
    //获取全部订单
    var that = this;
    wx.request({
      url: CONFIG.API_URL.delis,
      data: {
        openId: app.globalData.userInfo.openId,
        id: that.data.id
      },
      success(res) {
        var data = res.data;
        console.log(data);
        if (data.status == 1) {
          that.setData({
            orders: data.data
          });
        }

      }
    })
  },
  	showGoods: function (e) {
		var objectId = e.currentTarget.dataset.objectId;
		wx.navigateTo({
      url: '../../goods/detail/detail?goods_id=' + objectId
		});
	},
    pay: function (e) {
      var objectId = e.currentTarget.dataset.objectId;
      var totalFee = e.currentTarget.dataset.totalFee;
      console.log(objectId); console.log(totalFee);
      wx.navigateTo({
        url: '../payment/payment?orderId=' + objectId + '&totalFee=' + totalFee
      });
    },

});