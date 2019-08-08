const CONFIG = require('../../utils/config.js')
var app = getApp()
Page({
	data:{
    baseUrl: CONFIG.API_URL.URL,
		carts: [],
		minusStatuses: [],
		selectedAllStatus: false,
		total: '',
		startX: 0,
		itemLefts: []
	},
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    // var that = this;
    // that.carts();
  },
  onShow: function () {
    this.reloadData();
  },
  // del: function (e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.uid;
  //   wx.showModal({
  //     title: '提示',
  //     content: '确认要删除吗',
  //     success: function (res) {
  //       if (res.confirm) {
  //         wx.request({
  //           url: CONFIG.API_URL.collect_del,
  //           data: { id: id },
  //           success: function (res) {
  //             var data = res.data
  //             console.log(data);
  //             if (data.status == 1) {
  //               wx.showToast({
  //                 title: '已删除',
  //                 icon: 'success',
  //                 duration: 1000
  //               });
  //               that.carts();
  //             }
  //           }
  //         })

  //       }
  //     }
  //   })
  // },
	bindMinus: function(e) {
    var that = this
    var carts = this.data.carts;

		/**减去数量 */
		// wx.showLoading({
		// 	title: '操作中',
		// 	mask: true
		// });
		var index = parseInt(e.currentTarget.dataset.index);
    var num = carts[index]['number'];
		// 如果只有1件了，就不允许再减了
		if (num > 1) {
			num --;
      that.setCatNumber(num,index);
		}

	},
	bindPlus: function(e) {
    var that = this;
    /**加一个数量 */
		// wx.showLoading({
		// 	title: '操作中',
		// 	mask: true
		// });
		var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index]['number'];
		// 自增
		num ++;

    that.setCatNumber(num, index);
	},
	bindManual: function(e) {
    var that =this 
		// wx.showLoading({
		// 	title: '操作中',
		// 	mask: true
		// });
		var index = parseInt(e.currentTarget.dataset.index);
		var num = parseInt(e.detail.value);
    if (num <= 1) {
      num=1;

    }
    that.setCatNumber(num, index);
	},
  setCatNumber:function(num,index){
    /**设置购物车数量 */
    var that = this;
    var carts = that.data.carts;
    
    wx.request({
      url: CONFIG.API_URL.SetCat,
      data: {
        openId: that.data.userInfo.openId,
        id: carts[index]['id'],
        act: 3,
        num: num
      },
      success: function (res) {
        var data = res.data

        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 购物车数据
        carts[index]['number'] = num
        // 按钮可用状态
        var minusStatuses = that.data.minusStatuses;
        minusStatuses[index] = minusStatus;
        // 将数值与状态写回
        that.setData({
          carts: carts,
          minusStatuses: minusStatuses
        });
        wx.hideLoading();
        that.sum();
      }
    })
  },
	bindManualTapped: function() {
		// 什么都不做，只为打断跳转
	},
	bindCheckbox: function(e) {
    /**单选操作 */
    var that =this
		wx.showLoading({
			title: '操作中',
			mask: true
		});
		var index = parseInt(e.currentTarget.dataset.index);


		//原始的icon状态
    var selected = this.data.carts[index]['selected'];
    var carts = that.data.carts;
    var openId = that.data.userInfo.openId;
    var chuan = 0;
    if (!selected){
      chuan = 1;
    }else{
      chuan = 0;
    }
    wx.request({
      url: CONFIG.API_URL.SetCat,
      data: {
        openId: openId,
        id: carts[index]['id'],
        act:1,
        selected: chuan
      },
      success: function (res) {
        var data = res.data
        
        carts[index]['selected'] = !selected
        that.setData({
          carts: carts,
        });
        wx.hideLoading();
        that.sum();
      }
    }) 
	},
	bindSelectAll: function() {
    /**全选 */

    var that = this
		wx.showLoading({
			title: '操作中',
			mask: true
		});
		// 环境中目前已选状态
    var selectedAllStatus = that.data.selectedAllStatus;
		// 取反操作
		selectedAllStatus = !selectedAllStatus;
		// 购物车数据，关键是处理selected值
    var carts = that.data.carts;
		// 遍历
		for (var i = 0; i < carts.length; i++) {
      carts[i]['selected'] = selectedAllStatus
			// update selected status to db
		}
    var chuan = 0;
    if (selectedAllStatus) {
      chuan = 1;
    } else {
      chuan = 0;
    }
    var openId = that.data.userInfo.openId;
    wx.request({
      url: CONFIG.API_URL.SetCat,
      data: {
        openId: openId,
        act: 2,
        selected: chuan
      },
      success: function (res) {
        var data = res.data

        that.setData({
          selectedAllStatus: selectedAllStatus,
          carts: carts,
        });
        that.sum();
        wx.hideLoading();
      }
    })



	},
	bindCheckout: function() {
    if (app.globalData.userInfo == null){
      app.login();
    }else{
     
    /**立即结算 */
		var goods_ids = this.calcIds();
    if (goods_ids != ''){
    goods_ids = goods_ids.join(',');
		wx.navigateTo({
      url: '../../../../order/checkout/checkout?goods_ids=' + goods_ids + '&amount=' + this.data.total
		});
    }
    }
	},
	delete: function (e) {
		var that = this;
		// 购物车单个删除
		var id = e.currentTarget.dataset.id;

		wx.showModal({
			title: '提示',
			content: '确认要删除吗',
			success: function(res) {
				if (res.confirm) {
          wx.request({
            url: CONFIG.API_URL.SetCat,
            data: {
              openId: that.data.userInfo.openId,
              id: id,
              act: 4,
            },
            success: function (res) {
              var data = res.data
              if (data.status==1){

                that.reloadData();
                that.setData({
                  itemLefts: []
                });
              }
              wx.showToast({
                title: data.message,
                icon: 'success',
                duration: 1000
              });

            }
          })



				}
			}
		})
	},
	calcIds: function () {
		// 遍历取出已勾选的cid
		// var buys = [];
		var cartIds = [];
		for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i]['selected']) {
				// 移动到Buy对象里去
				// cartIds += ',';
        cartIds.push(this.data.carts[i]['id']);
			}
		}
		if (cartIds.length <= 0) {
			wx.showToast({
				title: '请勾选商品',
				icon: 'success',
				duration: 1000
			})
		}
		return cartIds;
	},
	reloadData: function() {
	/**获取购物车数据 */
		var that = this;
    var openId = that.data.userInfo.openId;

    wx.request({
      url: CONFIG.API_URL.GetCat,
      data: {
        openId: openId,
      },
      success: function (res) {
        var data = res.data
        var carts = data
        var minusStatuses = []
        for (var i = 0; i < carts.length; i++) {
          minusStatuses[i] = carts[i]['number'] <= 1 ? 'disabled' : 'normal';
        }
        that.setData({
          carts: carts,
          minusStatuses: minusStatuses
        });
        that.sum();
      }
    })
	},
	sum: function() {
		var carts = this.data.carts;
		// 计算总金额
		var total = 0;
		for (var i = 0; i < carts.length; i++) {
      if (carts[i]['selected']) {
        total += carts[i]['number'] * carts[i]['goods']['price'];
			}
		}
		total = total.toFixed(2);

    
		// 写回经点击修改后的数组
		this.setData({
			carts: carts,
			total: total
		});
	},
	showGoods: function (e) {
		// 点击购物车某件商品跳转到商品详情
    console.log(e);
		var id = e.currentTarget.dataset.uid;
		wx.navigateTo({
      url: '../goods/detail/detail?goods_id=' + id
		});
	},
  collect: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/collect/collect?id=' + id,
    })
  },
  index1: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  h5: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
	touchStart: function (e) {
		var startX = e.touches[0].clientX;
		this.setData({
			startX: startX,
			itemLefts: []
		});
	},
	touchMove: function (e) {
		var index = e.currentTarget.dataset.index;
		var movedX = e.touches[0].clientX;
		var distance = this.data.startX - movedX;
		var itemLefts = this.data.itemLefts;
		itemLefts[index] = -distance;
		this.setData({
			itemLefts: itemLefts
		});
	},
	touchEnd: function (e) {
		var index = e.currentTarget.dataset.index;
		var endX = e.changedTouches[0].clientX;
		var distance = this.data.startX - endX;
		// button width is 60
		var buttonWidth = 60;
		if (distance <= 0) {
			distance = 0;
		} else {
			if (distance >= buttonWidth) {
				distance = buttonWidth;
			} else if (distance >= buttonWidth / 2){
				distance = buttonWidth;
			} else {
				distance = 0;
			}
		}
		var itemLefts = this.data.itemLefts;
		itemLefts[index] = -distance;
		this.setData({
			itemLefts: itemLefts
		});
	},
  onShareAppMessage: function () {
    //分享设置
    return {
      title: '民生家园',
      desc: '民生家园微信小程序',
      path: '/pages/cart/cart'
    }
  },
})