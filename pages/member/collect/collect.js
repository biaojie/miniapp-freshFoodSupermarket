const CONFIG = require('../../../utils/config.js')
const app = getApp()
Page({
	data: {
    baseUrl: CONFIG.API_URL.URL,
    list:[]
	},
	onLoad: function (options) {
    var that=this;
    that.list();
	},
  del:function(e){
    var that=this;
    var id = e.currentTarget.dataset.uid;      
    wx.showModal({
      title: '提示',
      content: '确认要取消收藏吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: CONFIG.API_URL.collect_del,
            data: { id: id },
            success: function (res) {
              var data = res.data
              console.log(data);
              if (data.status == 1) {
                wx.showToast({
                  title: '已取消收藏',
                  icon: 'success',
                  duration: 1000
                });
                that.list();
              }
            }
          })
         
        }
      }
    })
  },
  list:function(){
    var that = this;
    var openid = app.globalData.userInfo.openId;
    wx.request({
      url: CONFIG.API_URL.collect_list,
      data: { openid: openid },
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data
        });
      }
    })
  },
  details:function(e){
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id
    });
  }

})