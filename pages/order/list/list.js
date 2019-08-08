const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
	data: {
    baseUrl: CONFIG.API_URL.URL,
		orders: [],
	},
	onLoad: function (options) {
		// 订单状态，已下单为0，已付为1，已发货为2，已收货为3
		var status = parseInt(options.status);
		// 存为全局变量，控制支付按钮是否显示
		this.setData({
			status: status
		});
	},
	onShow: function() {
		this.reloadData();
	},
	reloadData: function() {
    //获取全部订单
		var that = this;
    wx.request({
      url: CONFIG.API_URL.GetOrder,
      data: {
        openId: app.globalData.userInfo.openId,
        status:that.data.status
      },
      success(res) {
        var data = res.data;
        console.log(data);
        if (data.status==1){
          that.setData({
            orders: data.data
          });
        }

      }
    })
	},
	pay: function(e) {
		var objectId = e.currentTarget.dataset.objectId;
		var totalFee = e.currentTarget.dataset.totalFee;
		wx.navigateTo({
			url: '../payment/payment?orderId=' + objectId + '&totalFee=' + totalFee
		});
	},
	receive: function(e) {
		var that = this;
		wx.showModal({
			title: '请确认',
			content: '确认要收货吗',
			success: function(res) {
				if (res.confirm) {
					var objectId = e.currentTarget.dataset.objectId;
					var order = new AV.Object.createWithoutData('Order', objectId);
					order.set('status', 3);
					order.save().then(function () {
						wx.showToast({
							'title': '确认成功'
						});
						that.reloadData();
					});
					
				}
			}
		})
	},
	// showGoods: function (e) {
	// 	var objectId = e.currentTarget.dataset.objectId;
	// 	wx.navigateTo({
  //     url: '../../goods/detail/detail?goods_id=' + objectId
	// 	});
	// },
  showGoods: function (e) {
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: '../../order/details/details?goods_id=' + objectId
    });
  },
	evaluate: function (e) {
		var objectId = e.currentTarget.dataset.objectId;
		wx.navigateTo({
			url: '../../member/evaluate/evaluate?objectId=' + objectId
		});
	},
  /*删除订单*/
  hide:function(e){
    var that=this;
    var objectId = e.currentTarget.dataset.objectId;
    console.log(e);
    wx.request({
      url: CONFIG.API_URL.GetOrder,
      data: {
        openId: app.globalData.userInfo.openId,
        status: that.data.status,
        hide: objectId
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
    /*取消订单*/
  dele: function (e) {
    var that = this;
    var objectId = e.currentTarget.dataset.objectId;
    console.log(e);
    wx.request({
      url: CONFIG.API_URL.GetOrder,
      data: {
        openId: app.globalData.userInfo.openId,
        status: that.data.status,
        dele: objectId
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
  }
});