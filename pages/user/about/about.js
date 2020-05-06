const app = getApp()
const api = require('../../../utils/api.js')
Page({
  data: {
    currentData: ''
  },
  onLoad(){
    this.getData()
  },
  getData() {
    api.requestServerData('/api/member/about', 'get', {
      uid: app.globalData.uid,
      token: app.globalData.token
    }, true).then((res) => {
      if(res.data.status == 1) {
        this.setData({
          currentData: res.data.data[0].menu_content
        })
      }
    })
  }
})