const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    id: '',
    domeMode: true,
    nursing_workers_mobile: '',
    nursing_workers_bannerpic: '',
    nursing_workers_content: '',
    nursing_workers_money: '',
    checked: false,
    id: null
  },
  onLoad: function (options) { 
    let id = app.globalData.id
    this.getData(id)
  },
  // 获取页面数据
  getData(id) {
    api.requestServerData("/api/nursing_workers/nursing_workers_yuyueinfo", "post", {
      nursing_workers_id: id,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, true).then((res) => {
      let data = res.data.data
      if (res.data.status == 1){
        let img = data.nursing_workers_content
        const regex = new RegExp('<img', 'gi');
        img = img.replace(regex, `<img class="rich-img" `);
        this.data.nursing_workers_mobile = data.nursing_workers_mobile
        this.setData ({
          nursing_workers_bannerpic: data.nursing_workers_bannerpic,
          nursing_workers_content: img,
          nursing_workers_title: data.nursing_workers_title,
          nursing_workers_money: data.nursing_workers_money
        })
      }else{
        toolTip.photoTip('暂无数据', '../../../static/fail.png')
      }
    })
  },
  // 同意
  consent: function () {
    this.data.checked = !this.data.checked
    this.setData({
      checked: this.data.checked
    })
  },
  // 预约
  bindSubscribe: function () {
    if (this.data.checked) {
      wx.navigateTo({
        url: '../../subscribe/subscribe'
      })
    } else {
      toolTip.photoTip('请同意协议', '../../../static/fail.png')
    }
  },
  termSheet() {
    wx.navigateTo({
      url: 'view/view'
    })
  },
  onShow() {
    wx.removeStorageSync('timer')
  }
})