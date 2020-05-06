const app = getApp()
const api = require('../../../../utils/api.js')
const toolTip = require('../../../../utils/toolTip.js')
Page({
  data: {
    currentList: null,
    title: ''
  },
  onLoad: function (options) {
    this.getData()
  },
  getData(){
    api.requestServerData("/api/nursing_workers/yuyuexieyi", "get", {
      uid: app.globalData.uid,
      token: app.globalData.token
    }, true).then((res) => {
      let data = res.data.data[0]
      if (res.data.status == 1) {
        this.setData({
          currentList: data.menu_content,
          title: data.menu_name
        })
      } else {
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  }
})