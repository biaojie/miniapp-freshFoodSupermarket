const CONFIG = require('../../../utils/config.js')
var app = getApp()
Page({
	onLoad: function (options) {
		this.setData({
      uid: app.globalData.userInfo.openId
		});
	}
});