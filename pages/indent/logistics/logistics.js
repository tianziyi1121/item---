const app = getApp();
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
const common = require('../../../utils/common.js')
Page({
  data: {
    currentData: [],
    mailno: ''
  },
  onLoad (options) {
    this.data.orderId = options.id
    this.getData();
  },
  getData() {
    api.requestServerData('/api/member/route_query', 'get', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      orderId: this.data.orderId,
    }, this.data.flag).then((res) => {
      let data = res.data
      if(data.status == 1){
        let array = []
        if(data.data.route == undefined) {
          array.push(data.data.route_self)
        }else{
          data.data.route.push(data.data.route_self)
          array = data.data.route
        }
        this.setData({
          currentData: array,
          mailno: data.data.mailno == undefined ? '' : data.data.mailno
        })
      }else{
        toolTip.noPhotoTip(data.msg)
      }
    })
  },
  onPullDownRefresh() {
    this.getData()
  }
})