
const CONFIG = require('../../../utils/config.js')
const app = getApp()


// 使用function初始化array，相比var initSubMenuDisplay = [] 既避免的引用复制的，同时方式更灵活，将来可以是多种方式实现，个数也不定的
function initSubMenuDisplay() {
	return ['hidden', 'hidden', 'hidden'];
}

//定义初始化数据，用于运行时保存
var initSubMenuHighLight = [
['','','','',''],
['',''],
['','','']
];

var pageIndex = 0;
var that;
Page({
	data:{
    baseUrl: CONFIG.API_URL.URL,
    categoryId:0,
		subMenuDisplay:initSubMenuDisplay(),
		subMenuHighLight:initSubMenuHighLight,
		goods: [],
		loadingTip: '上拉加载更多',
    page:1,
    userInfo:"",
    input_name:''
	},
	onLoad: function(options){
   
    this.setData({
        categoryId: options.categoryId
    })
    this.setData({
      userInfo: app.globalData.userInfo
    });
    if (options.name != ''){
      this.search_list(options.name);
    }else{
      this.getGoods(options.categoryId, 0);
    }
    
	},
	getGoods: function(category, pageIndex){
    that = this;
    //加载列表
    // 关闭下拉刷新动画
    wx.stopPullDownRefresh();
    wx.request({
      url: CONFIG.API_URL.goods_list,
      data:{
        subid: category,
        page: that.data.page
      },
      success: function (res) {
        var data = res.data
        if (data){
          that.setData({
            goods: that.data.goods.concat(data)
          });
        }
      }
    })
    },
    /*查询*/
  search:function(e){
   
    var that = this;
    var category=that.data.categoryId;
    // var name = e.detail.value.name;
    var name = that.data.input_name;
    var order = e.currentTarget.dataset.index;
    console.log(order);
    wx.request({
      url: CONFIG.API_URL.goods_list,
      data: {
        subid: category,
        page:'1',
        name: name,
        order: order
      },
      success: function (res) {
        var data = res.data
        if (data) {
          that.setData({
            goods: data
          });
        }
      }
    })
  },
  search_list: function (name) {
    var that = this;
    wx.request({
      url: CONFIG.API_URL.goods_list,
      data: {
        subid: '',
        page: '1',
        uname: name
      },
      success: function (res) {
        var data = res.data
        if (data) {
          that.setData({
            goods: data
          });
        }
      }
    })
  },

  /*搜索输入框*/
  name: function (e) {
    var that = this;
    that.setData({
      input_name: e.detail.value
    })
  },

    tapGoods: function(e) {
      var goods_id = e.currentTarget.dataset.goods_id;
    	wx.navigateTo({
        url: "../detail/detail?goods_id=" + goods_id
    	});
    },
    tapMainMenu: function(e) {
		// 获取当前显示的一级菜单标识
		var index = parseInt(e.currentTarget.dataset.index);
		// 生成数组，全为hidden的，只对当前的进行显示
		var newSubMenuDisplay = initSubMenuDisplay();
		// 如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
		if(this.data.subMenuDisplay[index] == 'hidden') {
			newSubMenuDisplay[index] = 'show';
		} else {
			newSubMenuDisplay[index] = 'hidden';
		}
		// 设置为新的数组
		this.setData({
			subMenuDisplay: newSubMenuDisplay
		});
	},
	tapSubMenu: function(e) {
    //筛选
		// 隐藏所有一级菜单
		this.setData({
			subMenuDisplay: initSubMenuDisplay()
		});
		// 处理二级菜单，首先获取当前显示的二级菜单标识
		var indexArray = e.currentTarget.dataset.index.split('-');
		// 初始化状态
		// var newSubMenuHighLight = initSubMenuHighLight;
		for (var i = 0; i < initSubMenuHighLight.length; i++) {
			// 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
			if (indexArray[0] == i) {
				for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
					// 实现清空
					initSubMenuHighLight[i][j] = '';
				}
				// 将当前菜单的二级菜单设置回去
			}
		}

		// 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
		initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
		// 设置为新的数组
		this.setData({
			subMenuHighLight: initSubMenuHighLight
		});
	},
	onReachBottom: function () {
    var that = this
    //上啦加载
		setTimeout(function () {
      that.setData({
        page: (that.data.page + 1)
      })
			// 为页数迭加1
      that.getGoods(that.data.categoryId, that.data.page);

		}, 300);
	},
	onPullDownRefresh: function () {
    this.setData({
      page:1
    })
    this.getGoods(this.data.categoryId, 0);
	},
	addCart: function (e) {
    if (app.globalData.userInfo == null) {
      app.login();
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    var that=this;
    var openId = that.data.userInfo.openId;
 
    var goods_id = e.currentTarget.dataset.objectId;
    wx.request({
      url: CONFIG.API_URL.AddCat,
      data: {
        openId: openId,
        goods_id: goods_id
      },
      success: function (res) {
        var data = res.data
        if (data.status == 1) {
          that.showCartToast()
        }
      },
      fail: function (res) {
      }
    })
    //加入购物车
		var objectId = e.currentTarget.dataset.objectId;
		//var goods = AV.Object.createWithoutData('Goods', objectId);
	//	this.insertCart(goods);
	},
	insertCart: function (goods) {
		var that = this;
		// add cart
		var user = AV.User.current();
		var query = new AV.Query('Cart');
		query.equalTo('user', user);
		query.equalTo('goods', goods);
		// if count less then zero
		query.count().then(function (count) {
			if (count <= 0) {
				// if didn't exsit, then create new one
				var cart = AV.Object('Cart');
				cart.set('user', user);
				cart.set('quantity', 1);
				cart.set('goods', goods);
				cart.save().then(function(cart){
					that.showCartToast();
				},function(error) {
				});
			} else {
				// if exsit, get the cart self
				query.first().then(function(cart){
					// update quantity
					cart.increment('quantity', 1);
					// atom operation
					// cart.fetchWhenSave(true);
					that.showCartToast();
					return cart.save();
				}, function (error) {
				});
			}
		}, function (error) {

		});
	},
	showCartToast: function () {
		wx.showToast({
			title: '已加入购物车',
			icon: 'success',
			duration: 1000
		});
	},
  onShareAppMessage: function () {
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/goods/list/list'
    }
  },
  images:function(e){
    var url = e.currentTarget.dataset.img;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
});