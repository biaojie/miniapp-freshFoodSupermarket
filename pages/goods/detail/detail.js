
const WxParse = require('../../../utils/wxParse/wxParse.js');
const CONFIG = require('../../../utils/config.js')
const app = getApp()

Page({
	data: {
    baseUrl: CONFIG.API_URL.URL,
		goods: {},
		current: 0,
		galleryHeight: getApp().screenWidth,
    uid:'',
    tabClasss: ["text-select", "text-normal", "text-normal"],
    tab: 0,
    num:1
	},
	onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    this.getGoodsById(options.goods_id);
    this.setData({
      uid: options.goods_id
    })
	},
	getGoodsById: function(goodsId) {
    //获取商品详情
		var that = this
    wx.request({
      url: CONFIG.API_URL.goods_one,
      data:{
        goods_id: goodsId
      },
      success:function(res){
        var data = res.data
        console.log(data);
        that.setData({
          goods: data
        })
        WxParse.wxParse('detail', 'html', data.detail, that, 25);
        
      }
    })
  },
    /**
     * 加入购物车
     */
  addCart: function () {
    if (app.globalData.userInfo == null) {
      app.login();
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
		var that = this;
    var openId = that.data.userInfo.openId;
    wx.request({
      url: CONFIG.API_URL.AddCat,
      data: {
        openId: openId,
        goods_id: that.data.goods.id,
        num:1,
        strus:0
      },
      success:function(res){
        console.log(res);
        var data = res.data
        if (data.status == 1){
          that.showCartToast()
        }
      },
      fail:function(res){

      }
    })
    that.showCartToast();

	},
  buynow:function(){
    if (app.globalData.userInfo == null) {
      app.login();
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    var that=this;
    var goods_ids=that.data.goods.id;
    var price=that.data.goods.price;
    var openId = that.data.userInfo.openId;
    var num=that.data.num;
    wx.showLoading({
      title: '正在处理..',
    })
    wx.request({
      url: CONFIG.API_URL.AddCat,
      data: {
        openId: openId,
        goods_id: goods_ids,
        num: num,
        strus:1
      },
      success: function (res) {
        wx.hideLoading()
        var data = res.data
        var price = that.data.goods.price * num;
        if (data.status == 1) {
          wx.navigateTo({
            url: '../../order/checkout/checkout?goods_ids=' + data.showCat_ids + '&amount=' + price + '&num=' + num
          });
        }
      },
      fail: function (res) {

      }
    })

  },
	showCartToast: function () {
		wx.showToast({
			title: '已加入购物车',
			icon: 'success',
			duration: 1000
		});
	},
	previewImage: function (e) {
    var img=e.currentTarget.dataset.current;
		wx.previewImage({
			// current: this.data.goods.get('images')[parseInt(e.currentTarget.dataset.current)],
			// urls: this.data.goods.get('images') // 需要预览的图片http链接列表
      current:'',
      urls: [img]
		})
	},
	showCart: function () {
    wx.switchTab({
			url: '../../index/index'
		});
	},
  onShareAppMessage: function () {
    var that=this;
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/goods/detail/detail?goods_id=' + that.data.uid
    }
  },
  house:function(){
    if (app.globalData.userInfo == null) {
      app.login();
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    var that = this;
    var goods_ids = that.data.goods.id;
    var openId = that.data.userInfo.openId;
    wx.request({
      url: CONFIG.API_URL.collect_add,
      data: { openId: openId, goods_id: goods_ids},
      success: function (res) {
        var data = res.data
        if (data.status == 1) {
          that.shoucang()
        }
      }

    })
  },
  shoucang: function () {
    wx.showToast({
      title: '已收藏',
      icon: 'success',
      duration: 1000
    });
  },

  /*tab切换*/
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index })
  },
  
  /*数量+*/
  bindPlus:function(){
    var that=this;
    var num =parseInt(that.data.num)+1;
    that.setData({
      num: num
    })
  },
  /*数量-*/
  bindMinus: function () {
    var that = this;
    if (that.data.num == 1){
      var num = 1;
    }else{
      var num = parseInt(that.data.num) - 1;
    }
    that.setData({
      num: num
    })
  }
});