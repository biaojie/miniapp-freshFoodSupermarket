const CONFIG = require('../../../utils/config.js')
var app = getApp()
// var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
Page({
	isDefault: false,
	formSubmit: function(e) {
    /**单表提交 */
    var that = this

		var detail = e.detail.value.detail;
		var realname = e.detail.value.realname;
		var mobile = e.detail.value.mobile;
    var area = this.data.areaSelectedStr;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;

    if (area == '请选择省市区') {
			wx.showToast({
				title: '请输入区域'
			});
			return;
		}
		if (detail == '') {
			wx.showToast({
				title: '请填写详情地址'
			});
			return;
		}
		if (realname == '') {
			wx.showToast({
				title: '请填写收件人'
			});
			return;
		}
		if(!(/^1[34578]\d{9}$/.test(mobile))){ 
			wx.showToast({
				title: '请填写正确手机号码'
			});
			return;
		}
		// save address to leanCloud
		var id = 0;
    var isDefault = 0;
    if (that.isDefault) {
      isDefault = 1;
    }
		// 如果是编辑地址而不是新增
		if (this.data.address != undefined) {
			id = this.data.address.id;
      if (this.data.address.isDefault){
        isDefault = 1;
      }else{
        isDefault = 0;
      }
		}

    wx.request({
      url: CONFIG.API_URL.Address_add,
      data: {
        openId: that.data.userInfo.openId,
        isDefault: isDefault,
        detail: detail,
        realname: realname,
        mobile: mobile,
        area: area,
        id:id,
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        var data = res.data

        wx.showToast({
          title: '保存成功',
          duration: 500
        });
        // 等待半秒，toast消失后返回上一页
        setTimeout(function () {
          wx.navigateBack();
        }, 500);
      }
    })
	},
	data: {
		current: 0,
		province: [],
		city: [],
		region: [],
		town: [],
		provinceObjects: [],
		cityObjects: [],
		regionObjects: [],
		townObjects: [],
		areaSelectedStr: '请选择省市区',
		maskVisual: 'hidden',
		provinceName: '请选择'
	},
	getArea: function (pid, cb) {
		var that = this;

    wx.request({
      url: CONFIG.API_URL.Area,
      data: {
        openId: that.data.userInfo.openId,
        pid: pid
      },
      success: function (res) {
        var data = res.data
        cb(data);
      }
    })
	},
	onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
		// 实例化API核心类
		// qqmapsdk = new QQMapWX({
    //   key: 'QD6BZ-I4V6U-32XVV-23L5H-IJPNS-3XF3Y'
		// });
		var that = this;
		// 加载城市联动
		this.getArea(1, function (area) {
			var array = [];
			for (var i = 0; i < area.length; i++) {
        array[i] = area[i]['name'];
			}
			that.setData({
				province: array,
				provinceObjects: area
			});
		});
		this.setDefault();
		this.loadAddress(options);

	},
	loadAddress: function (options) {
    //编辑的
		var that = this;
		if (options.id != undefined) {
      wx.request({
        url: CONFIG.API_URL.Address_one,
        data: {
          openId: that.data.userInfo.openId,
          id: options.id
        },
        success: function (res) {
          var data = res.data
          that.setData({
            address: data.data,
            areaSelectedStr: data.data['area']
          });
        }
      })
		}
	},
	setDefault: function () {
  /**如果收货地址小于一就默认收货地址 */
		var that = this;
    wx.request({
      url: CONFIG.API_URL.Address_count,
      data: {
        openId: that.data.userInfo.openId,
      },
      success: function (res) {
        var data = res.data
        if (data <= 0) {
          that.isDefault = true;
        }
      }
    })
	},
	cascadePopup: function() {
		var animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease-in-out',
		});
    console.log(animation);
		this.animation = animation;
		animation.translateY(-285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'show'
		});
	},
	cascadeDismiss: function () {
		this.animation.translateY(285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'hidden'
		});
	},
	provinceTapped: function(e) {
    	// 标识当前点击省份，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// current为1，使得页面向左滑动一页至市级列表
    	// provinceIndex是市区数据的标识
    	this.setData({
    		provinceName: this.data.province[index],
    		regionName: '',
    		townName: '',
    		provinceIndex: index,
    		cityIndex: -1,
    		regionIndex: -1,
    		townIndex: -1,
    		region: [],
    		town: []
    	});
    	var that = this;
    	//provinceObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
    	// getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
      this.getArea(this.data.provinceObjects[index]['id'], function (area) {
    		var array = [];
    		for (var i = 0; i < area.length; i++) {
          array[i] = area[i]['name'];
    		}
			// city就是wxml中渲染要用到的城市数据，cityObjects是LeanCloud对象，用于县级标识取值
			that.setData({
				cityName: '请选择',
				city: array,
				cityObjects: area
			});
			// 确保生成了数组数据再移动swiper
			that.setData({
				current: 1
			});
		});
    },
    cityTapped: function(e) {
    	// 标识当前点击县级，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// current为1，使得页面向左滑动一页至市级列表
    	// cityIndex是市区数据的标识
    	this.setData({
    		cityIndex: index,
    		regionIndex: -1,
    		townIndex: -1,
    		cityName: this.data.city[index],
    		regionName: '',
    		townName: '',
    		town: []
    	});
    	var that = this;
    	//cityObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
    	// getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
      this.getArea(this.data.cityObjects[index]['id'], function (area) {
    		var array = [];
    		for (var i = 0; i < area.length; i++) {
          array[i] = area[i]['name'];
    		}
			// region就是wxml中渲染要用到的城市数据，regionObjects是LeanCloud对象，用于县级标识取值
			that.setData({
				regionName: '请选择',
				region: array,
				regionObjects: area
			});
			// 确保生成了数组数据再移动swiper
			that.setData({
				current: 2
			});
		});
    },
    regionTapped: function(e) {
    	// 标识当前点击镇级，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// current为1，使得页面向左滑动一页至市级列表
    	// regionIndex是县级数据的标识
    	this.setData({
    		regionIndex: index,
    		townIndex: -1,
    		regionName: this.data.region[index],
    		townName: ''
    	});
    	var that = this;
    	//townObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
    	// getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
      this.getArea(this.data.regionObjects[index]['id'], function (area) {
			// 假如没有镇一级了，关闭悬浮框，并显示地址
			if (area.length == 0) {
				var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
				that.setData({
					areaSelectedStr: areaSelectedStr
				});
				that.cascadeDismiss();
				return;
			}
			var array = [];
			for (var i = 0; i < area.length; i++) {
        array[i] = area[i]['name'];
			}
			// region就是wxml中渲染要用到的县级数据，regionObjects是LeanCloud对象，用于县级标识取值
			that.setData({
				townName: '请选择',
				town: array,
				townObjects: area
			});
			// 确保生成了数组数据再移动swiper
			that.setData({
				current: 3
			});
		});
    },
    townTapped: function (e) {
    	// 标识当前点击镇级，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// townIndex是镇级数据的标识
    	this.setData({
    		townIndex: index,
    		townName: this.data.town[index]
    	});
    	var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName + this.data.townName;
    	this.setData({
    		areaSelectedStr: areaSelectedStr
    	});
    	this.cascadeDismiss();
    },
    currentChanged: function (e) {
    	// swiper滚动使得current值被动变化，用于高亮标记
    	var current = e.detail.current;
    	this.setData({
    		current: current
    	});
    },
    changeCurrent: function (e) {
    	// 记录点击的标题所在的区级级别
    	var current = e.currentTarget.dataset.current;
    	this.setData({
    		current: current
    	});
    },
    fetchPOI: function () {
    	var that = this;

      wx.chooseLocation({
        success: function(res) {
          console.log(res)
				that.setData({
          areaSelectedStr: res.address + res.name,
          latitude: res.latitude,
          longitude: res.longitude
				});
        }
      })
    	// 调用接口
    // 	qqmapsdk.reverseGeocoder({
    // 		poi_options: 'policy=2',
    // 		get_poi: 1,
		//     success: function(res) {
		// 		console.log(res);
		// 		that.setData({
		// 			areaSelectedStr: res.result.address
		// 		});
		//     },
		//     fail: function(res) {
		//          console.log(res);
		//     },
		//     complete: function(res) {
		//          console.log(res);
		//     }
    // 	});
    }
})