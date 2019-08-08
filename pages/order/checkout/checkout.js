const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
  data: {
    baseUrl: CONFIG.API_URL.URL,
    amount: 0,
    carts: [],
    addressList: [],
    addressIndex: 0,
    tips: "",
    test: 'ceshi',
    psf: 0,
    money: 0,
    num: 1,
    tel: '',
    time: '',
    hour: '',
    // date: '请选择配送日期',
    // shij: '请选择配送时间',
    config: [],
    good_dd: [],
    remarks: '',
    score:''
  },
  addressObjects: [],

  onLoad: function (options) {
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      amount: options.amount,
      goods_ids: options.goods_ids,
      num: options.num
    });
    // var mydate = new Date();
    // var y = mydate.getFullYear();
    // var m = mydate.getMonth() + 1;
    // var d = mydate.getDate();
    // var h = mydate.getHours();
    // var i = mydate.getMinutes();
    // if (m - 12 > 0) {
    //   y = y + 1;
    // }
    // var time = y + '-' + m + '-' + d;
    // var hour = h + ':' + i;
    // that.setData({
    //   time: time,
    //   hour: hour
    // })
    wx.request({
      url: CONFIG.API_URL.config,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          config: res.data
        })
      }
    })
    if (app.globalData.userInfo == null) {
      this.login();
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.request({
      url: CONFIG.API_URL.good_dd,
      data: { openId: app.globalData.userInfo.openId, goods_ids: options.goods_ids },
      method: 'POST',
      success: function (res) {
        that.setData({
          good_dd: res.data
        })
      }
    })
    wx.request({
      url: CONFIG.API_URL.score,
      data: { openId: app.globalData.userInfo.openId, goods_ids: options.goods_ids },
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        that.setData({
          score: res.data.score
        })
        console.log(res.data.score)
      }
    })
  },
  onShow: function () {
    this.loadAddress();


  },
  //选择日期
  // bindDateChange: function (e) {
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },
  //选择时间
  // bindtime: function (e) {
  //   this.setData({
  //     shij: e.detail.value
  //   })
  // },
  //买家备注
  remarks: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  confirmOrder: function () {

    /**提交订单 */
    // submit order

    var carts = this.data.carts;
    var that = this;
    var addressindex = that.data.addressIndex;
    var address = that.data.addressList;
    // var date = this.data.date;
    // var shij = this.data.shij;
    var remarks = this.data.remarks;

    // if (date == '请选择配送日期') {
    //   wx.showToast({
    //     icon: 'loading',
    //     title: '请选择日期'
    //   })
    //   return false;
    // }
    // if (shij == '请选择配送时间') {
    //   wx.showToast({
    //     icon: 'loading',
    //     title: '请选择时间'
    //   })
    //   return false;
    // }


    if (address.length < 1 && addressindex == '0') {
      wx.showToast({
        title: '请先添加地址',
        duration: 1500,
        icon: 'loading'
      });
      that.setData({ tips: "请先添加地址" })
    } else {
      that.setData({ tips: " " })
      wx.request({
        url: CONFIG.API_URL.Order,
        data: {
          openId: app.globalData.userInfo.openId,
          goods_ids: that.data.goods_ids,
          address_id: that.addressObjects[that.data.addressIndex]['id'],
          psf: that.data.psf,
          // shij: shij,
          // date: date,
          remarks: remarks
        },
        success: function (res) {
          var data = res.data
          if (data.status == 1) {
            // 保存到云端
            var orderId = data.data['order_id'];
            var totalFee = data.data['amount'];
            that.submitInfo(orderId, totalFee);
          } else {
            wx.showToast({
              title: data.message,
              duration: 1000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/order/list/list'
              })
            }, 1000)
          }
        }, fail: function (res) {
          wx.showToast({
            title: '系统出错',
            duration: 1000
          });
        }
      })
    }

  },
  loadAddress: function () {
    //获取默认地址
    var that = this;
    wx.request({
      url: CONFIG.API_URL.Address_list,
      data: {
        openId: that.data.userInfo.openId,

      },
      success: function (res) {
        var data = res.data;
        var addressList = [];
        var addressObjects = [];

        for (var i = 0; i < data.data.length; i++) {
          // find the default address
          if (data.data[i]['isDefault'] == true) {
            that.setData({
              addressIndex: i
            });
          }
          addressList.push(data.data[i]['area'] + data.data[i]['detail']);
        }
        that.setData({
          addressList: addressList
        });
        if (addressList.length > 0) {
          that.setData({ tips: " " })
        } else {
          that.setData({ tips: "请先添加地址" })
        }

        that.addressObjects = data.data;



        //获取配送费金额
        var key = that.data.addressIndex;
        var driv = data.data[key];
        var money = parseFloat(that.data.amount) + parseFloat(driv.psf);
        var aa = Math.round(money * 100);
        var money = aa / 100;
        that.setData({
          psf: driv.psf,
          money: money,
          tel: driv.mobile,
          realname: driv.realname
        })
      }

    })


  },
  bindPickerChange: function (e) {
    var that = this;
    var key = e.detail.value;
    var driv = that.addressObjects[key];
    var money = parseFloat(that.data.amount) + parseFloat(driv.psf);
    var aa = Math.round(money * 100);
    var money = aa / 100;

    that.setData({
      psf: driv.psf,
      money: money,
      tel: driv.mobile,
      realname: driv.realname
    })
    //选择地址
    this.setData({
      addressIndex: e.detail.value
    })
  },
  bindCreateNew: function () {
    //添加地址
    var addressList = this.data.addressList;
    if (addressList.length == 0) {
      wx.navigateTo({
        url: '../../address/add/add'
      });
    }
  },
  submitInfo: function (orderId, totalFee) {
    var that = this;
    //统一下单接口对接
    wx.request({
      url: CONFIG.API_URL.WeiaPay,
      data: {
        openId: app.globalData.userInfo.openId,
        body: '民生家园',
        tradeNo: orderId,
        totalFee: parseFloat(totalFee) * 100
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
          'success': function (res) {
            wx.showLoading({
              title: '支付处理中',
            })
            wx.request({
              url: CONFIG.API_URL.SetOrderStatus,
              data: {
                openId: app.globalData.userInfo.openId,
                tradeNo: orderId,
                prepay_id: response.data.package,
                form_id: 'the formId is a mock one'
              },
              success(res1) {
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