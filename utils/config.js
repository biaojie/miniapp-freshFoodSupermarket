const BASE = '';
const API_BASE = BASE + '/addons/shuiguo/shop/api/';

const appId = "wxd4f02b4db674e1d5";
const appKey = "e9f2acbf6e023200605762a7535016a2";

const CONFIG = {
  API_URL: {
    URL: BASE,
    banner: API_BASE + '/banner',
    getSession: API_BASE + '/getSession',
    goods_labels: API_BASE + '/goods_labels',
    Category: API_BASE + '/Category',
    SubCategory: API_BASE + '/SubCategory',
    goods_one: API_BASE + '/goods_one',
    goods_list: API_BASE + '/goods_list',
    AddCat: API_BASE + '/AddCat',
    GetCat: API_BASE + '/GetCat',
    SetCat: API_BASE + '/SetCat',
    Address_list: API_BASE + '/Address_list',
    Address_add: API_BASE + '/Address_add',
    Area: API_BASE + '/Area',
    Address_count: API_BASE + '/Address_count',
    Address_one: API_BASE + '/Address_one',
    Address_add: API_BASE + '/Address_add',
    SetAddress: API_BASE + '/SetAddress',
    WeiaPay: API_BASE + '/WeiaPay',
    Order: API_BASE + '/Order',
    SetOrderStatus: API_BASE + '/SetOrderStatus',
    GetOrder: API_BASE + '/GetOrder',
    navbarlist:API_BASE+'/navbarlist',
    integral: API_BASE + '/integral',
    contact: API_BASE + '/contact',
    list_contact: API_BASE + '/list_contact',
    data_contact: API_BASE + '/data_contact', 
    list_help: API_BASE + '/list_help',
    feed_add: API_BASE + '/feed_add',
    collect_add: API_BASE + '/collect_add',
    collect_list: API_BASE + '/collect_list', 
    collect_del: API_BASE + '/collect_del', 
    tel_sms: API_BASE + '/tel_sms', 
    tel_user: API_BASE + '/tel_user', 
    mobile: API_BASE + '/mobile', 
    delis: API_BASE + '/delis', 
    score: API_BASE + '/score', 
    driving: API_BASE + '/driving', 
    config: API_BASE + '/config',
    good_dd: API_BASE + '/good_dd',
    ma: API_BASE + '/ma',
    images_url: API_BASE +'/images_url'
  }
}

module.exports = CONFIG;