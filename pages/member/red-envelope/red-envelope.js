// pages/member/red-envelope/red-envelope.js
Page({

  data: {
    tabClasss: ["nav11", "nav1", "nav1"],
    tab: 0,
  },

  onLoad: function (options) {
  
  },

  onShow: function () {
  
  },

  onShareAppMessage: function () {
  
  },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["nav1", "nav1", "nav1"]
    classs[index] = "nav11"
    this.setData({ tabClasss: classs, tab: index })
  },
  now: function(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})