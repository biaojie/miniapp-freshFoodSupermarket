const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({
  data: {
    baseUrl: CONFIG.API_URL.URL,
    banner: [],
    goods_labels: [],
    bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth),
    navbar: [],
    phone: "",
    wheight:'',
    bjt:[],
  },
  onLoad: function (options) {
    var that = this;
    // this.loadBanner();
    // this.loadMainGoods();
    this.getInviteCode(options);
    // this.loadNavBar();
    // var a = this.data.est;
    // if (a == "" || a == null) {
    //   //内容为空
    //   $("#description_show").hide()
    // } else {
    //   $("#description_show").show()
    // }
    wx.request({
      url: CONFIG.API_URL.Category,
      success: function (res) {
        var data = res.data
        that.setData({
          bjt: data
        })
      }
    })

    wx.request({
      url: CONFIG.API_URL.images_url,
      success: function (res) {

        var data = res.data
        var img = data.savepath + data.savename;
        that.setData({
          img_url: img
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        var width=res.windowWidth
        var height=width/2
        that.setData({
          wheight: height
        })   
      }
      
    })

  },
  onShow: function () {
    var that = this
    this.loadBanner();
    this.loadMainGoods();
    this.loadNavBar()
  },
  getInviteCode: function (options) {
    //来自谁的分享
    // if (options.uid != undefined) {
    // 	wx.showToast({
    // 		title: '来自用户:' + options.uid + '的分享',
    // 		icon: 'success',
    // 		duration: 2000
    // 	})
    // }
  },
  loadBanner: function () {
    // 加载首页轮播图广告
    var that = this
    wx.request({
      url: CONFIG.API_URL.banner,
      success: function (res) {
        var data = res.data
        that.setData({
          banner: data.data
        })
        that.setData({
          phone: data.phone
        })
      }
    })
  },
  loadMainGoods: function (e) {
    // 加载热卖推荐
    var that = this;
    wx.request({
      url: CONFIG.API_URL.goods_labels,
      success: function (res) {
        var data = res.data
        
        that.setData({
          goods_labels: data
        })
        console.log(data)
      }
    })
  },


  search: function (e) {
    var name = e.detail.value.name;
    wx.navigateTo({
      url: '/pages/goods/list/list?name=' + name,
    })

    // 加载热卖推荐
    // var that = this;
    // wx.request({
    //   url: CONFIG.API_URL.goods_labels,
    //   data: { name: name },
    //   success: function (res) {
    //     var data = res.data
    //     that.setData({
    //       goods_labels: data
    //     })
    //   }
    // })
  },
  //加载导航栏
  loadNavBar: function () {
    var that = this;
    wx.request({
      url: CONFIG.API_URL.navbarlist,
      success: function (res) {
        var data = res.data;
        that.setData({
          navbar: res.data
        })
      }
    })
  },
  callme: function () {

    wx.makePhoneCall({
      phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    })
  },
  showDetail: function (e) {
    var goods_id = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: "../goods/detail/detail?goods_id=" + goods_id
    });
  },
  showCategories: function () {
    // 全部分类
    wx.switchTab({
      url: "../category/category"
    });
  },
  showOrders: function () {
    // 我的订单
    wx.navigateTo({
      url: "../order/list/list?status=0"
    });
  },
  onShareAppMessage: function () {
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园',
      path: '/pages/index/index'
    }
  },
  showGoods: function (e) {
    var goods_id = e.currentTarget.dataset.id
    if (goods_id != 0) {
      //轮播图转跳
      wx.navigateTo({
        url: '../goods/detail/detail?goods_id=' + goods_id
      });
    }
  },
  showgoodsinfoall: function (options) {
    var cate_id = options.currentTarget.dataset.id;
    var name = '';
    wx.navigateTo({
      url: '../goods/list/list?categoryId=' + cate_id + '&name=' + name,
    })
  },
  showgoodsjifen: function (options) {
    var cate_id = options.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/list/list_jifen',
    })
  },
  contact: function () {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  }


})