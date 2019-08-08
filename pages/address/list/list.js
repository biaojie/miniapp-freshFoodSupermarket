const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
	add: function () {
		wx.navigateTo({
			url: '../add/add'
		});
	},
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
	onShow: function () {
		this.loadData();
	},
	setDefault: function (e) {
		// 设置为默认地址
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 遍历所有地址对象设为非默认
		var addressObjects = that.data.addressObjects;
		for (var i = 0; i < addressObjects.length; i++) {
			// 判断是否为当前地址，是则传true
      if (i == index){
        addressObjects[i]['isDefault'] = true
      } else{
        addressObjects[i]['isDefault'] = false
      }
		}
    wx.request({
      url: CONFIG.API_URL.SetAddress,
      data: {
        openId: that.data.userInfo.openId,
        act:1,
        id: addressObjects[index]['id'],
      },
      success: function (res) {
        var data = res.data
        that.setData({
          addressObjects: addressObjects
        });
        wx.showToast({
          title: data.message,
          icon: 'success',
          duration: 2000
        });
      }
    })


	},
	edit: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 取出id值
		var id = this.data.addressObjects[index]['id'];
		wx.navigateTo({
      url: '../add/add?id=' + id
		});
	},
	delete: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 找到当前地址AVObject对象
		var address = that.data.addressObjects[index];
		// 给出确认提示框
		wx.showModal({
			title: '确认',
			content: '要删除这个地址吗？',
			success: function(res) {
				if (res.confirm) {

          wx.request({
            url: CONFIG.API_URL.SetAddress,
            data: {
              openId: that.data.userInfo.openId,
              act: 2,
              id: address['id'],
            },
            success: function (res) {
              var data = res.data
              wx.showToast({
                title: data.message,
                icon: 'success',
                duration: 2000
              });
              // 重新加载数据
              that.loadData();
            }
          })
				}
			}
		})
		
	},
	loadData: function () {
		// 加载网络数据，获取地址列表
		var that = this;
    wx.request({
      url: CONFIG.API_URL.Address_list,
      data: {
        openId: that.data.userInfo.openId,
      },
      success: function (res) {
        var data = res.data

        that.setData({
          addressObjects: data.data
        });
      }
    })


	}
})