
const CONFIG = require('../../utils/config.js')
const app = getApp()

Page({
    data: {
        baseUrl: CONFIG.API_URL.URL,
        topCategories: [],
        subCategories: [],
        highlight:['highlight'],
        banner:0,
    },
    onLoad: function(){
      var that=this;
        // this.getCategory();
        this.setImageWidth();
        this.setSideHeight();
        wx.request({
          url: CONFIG.API_URL.ma,
          data: {
            // pid: pid
          },
          success: function (res) {
            var data = res.data
            that.setData({
              subCategories: data
            })
            console.log(data)
            // wx.hideLoading()
          }
        })

    },
    setImageWidth: function () {
      var screenWidth = app.screenWidth;
        var imageWidth = (screenWidth - 130) / 3 - 5;
        this.setData({
            imageWidth: imageWidth
        });
    },
    setSideHeight: function () {
      //一级分类高度
        this.setData({
          sidebarHeight: app.screenHeight
        });
        console.log(this.data.sidebarHeight)
    },
    tapTopCategory: function(e){
      // 切换分类
      // 拿到id，作为访问子类的参数
      var pid = e.currentTarget.dataset.pid;

      // 查询父级分类下的所有子类
      this.getSubCategory(pid)
      
      // 设定高亮状态
      var index = parseInt(e.currentTarget.dataset.index);

      this.setHighlight(index);
    },
    // getCategory: function(){
    //   var that = this
    //   //一级分类
    //   wx.request({
    //     url: CONFIG.API_URL.Category,
    //     success: function (res) {
    //       console.log(res);
    //       var data = res.data
    //       that.setData({
    //         topCategories: data
    //       })
    //       that.getSubCategory(data[that.data.banner]['id'])
    //     }
    //   })
    // },
    getSubCategory: function (pid) {
      var that = this

      // wx.showLoading({
      //   title: '加载中...',
      // })
      //二级级分类
      // wx.request({
      //   url: CONFIG.API_URL.ma,
      //   data:{
      //     // pid: pid
      //   },
      //   success: function (res) {
      //     var data = res.data
      //     that.setData({
      //       subCategories: data
      //     })
      //     wx.hideLoading()
      //   }
      // })
    },
    setHighlight: function(index){
        var highlight = [];
        for (var i = 0; i < this.data.topCategories; i++) {
            highlight[i] = '';
        }
        highlight[index] = 'highlight';
        this.setData({
            highlight: highlight,
            banner: index
        });
    },
    avatarTap: function(e){
      //跳转在商品列表
        // 拿到objectId，作为访问子类的参数
      var subid = e.currentTarget.dataset.subid;
      var name='';
      console.log(e); console.log(subid);
        wx.navigateTo({
          url: "../../../../goods/list/list?categoryId=" + subid + '&name=' + name
        });
    },
    showGoods: function () {
      //跳转在商品详情
        wx.navigateTo({
            url: '../goods/detail/detail?objectId=5816e3b22e958a0054a1d711'
        });
    },
    onShareAppMessage: function () {
      //分享设置
      return {
        title: '民生家园',
        desc: '民生家园微信小程序',
        path: '/pages/category/category'
      }
    },
})