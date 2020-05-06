module.exports.requestServerData = function (url, method, data,flag, type) {
  return new Promise(function (resolve, reject) {
    if (flag){
      wx.showLoading({
        title: '拼命加载中~~~',
      })
    }
    let header = {}
    if (method == 'get'){
      header= {
        'content-type': 'application/json'
      }
    }else{
      header = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    // wx.onNetworkStatusChange(function (res) {
    //   console.log(res.isConnected)
    //   console.log(res.networkType)
    // })
    wx.request({
      url: type == 1 ? "https://kefu.easemob.com" + url : "https://www.rqxjzjxq.com/index.php" + url,
      data: data,
      header: header,
      method: method,
      success: function (res) {
        resolve(res)
        if (flag){
          setTimeout(() => {
            wx.hideLoading()
          }, 500)
        }
      },
      fail: function (res) {
        reject(res)
        setTimeout(() => {
          wx.hideLoading()
        }, 500)
      }
    })
    
  })
}