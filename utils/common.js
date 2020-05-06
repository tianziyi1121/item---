const api = require("api.js")
const toolTip = require("toolTip.js")
// 获取屏幕高度
module.exports.windowHeight = function(){
  let height = ''
  wx.getSystemInfo({
    success: function (res) {
      height = (res.windowHeight * (750 / res.windowWidth))
    }
  })
  return height
}

// 获取银行卡信息
module.exports.bankData = function (uid,token) {
  return new Promise((resolve,reject) => {
    api.requestServerData("/api/Member/bank_edit", "post", {
      token: token,
      uid: uid
    }, false).then((res) => {
      let type = null
      if (res.data.status == 1) {
        type = 1
        wx.setStorageSync('lsh_bankData', res.data.data)
      } else if (res.data.status == 2) {
        // 没绑卡
        type = 2
        wx.removeStorageSync('lsh_bankData')
      }
      resolve(type)
    })
  })
}

// 个人信息
module.exports.userData = function (uid, token) {
  return new Promise((resolve, reject) => {
    api.requestServerData('/api/member/index', 'get', {
      uid: uid,
      token: token
    }, false).then((res) => {
      let data = res.data   
      resolve(data)
    })
  })
}

// 定位
var QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'LHKBZ-Q3CW6-BUDSN-MN7R4-NUU72-TQBOR' // 这里自己的key秘钥进行填充
});
// 位置授权
module.exports.getUserLocation = function (){
  let vm = this;
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: '../static/fail.png',
                  duration: 1000
                })
                reject(2)
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      resolve(1)
                    } else {
                      reject(2)
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          resolve(1)
        } else {
          resolve(1)
        }
      }
    })
  })
}

// 微信获得经纬度
module.exports.getLocation = function (){
  let vm = this;
  return new Promise((resolve,reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let data = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        resolve(data)
      }
    })
  })
}

// 获取当前地理位置
module.exports.getLocal = function(data) {
  let self = this;
  return new Promise((resolve,reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: data.latitude,
        longitude: data.longitude
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
} 

// auth code
module.exports.getCode = function(data) {
  return new Promise((resolve, reject) => {
    api.requestServerData('/api/Login/sendsms', 'post', {
      member_list_tel: data
    }, false).then((res) => {
      if (res.data.status == 1 || res.data.status == 2) {
        resolve(res.data.data)
        toolTip.noPhotoTip(res.data.msg)
      } else {
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  })
}

// get latitude and longitude
module.exports.getLat = function(data) {
  return new Promise((resolve,reject) => {
    qqmapsdk.geocoder({
      address: data,   //用户输入的地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
      complete: res => {
        resolve(res)
      }
    });
  })
}

// Obtain product information
module.exports.productInformation = function (id, uid, token) {
  return new Promise((resolve, reject) => {
    api.requestServerData('/api/product/product_cont', 'get', {
      // uid: uid,
      product_id: id,
      // token:token,
      p: 1
    }, false).then((res) => {
      resolve(res)
    })
  })
}

module.exports.imageStyle = function (data) {
  let html = data
    // .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
    // .replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;">')
    .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
    .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
    .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
    .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
    .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1');
  html = html.replace(/<img/gi, "<img style='width:auto!important;height:auto!important;max-height:100%;max-width:100%; margin: 10px 0 0 0 0;'");
  return html
}
