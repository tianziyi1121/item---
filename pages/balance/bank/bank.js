const app = getApp()
const api = require('../../../utils/api.js')
const common = require('../../../utils/common.js')
Page({
  data: {
    bankFlag: false,
    type: null,
    currentList: '',
    dataFlag: true,
    type: null
  },
  onLoad: function (options) {
    let flagData = false
    if (options.flag){
      flagData = true
    }
    this.data.dataFlag = flagData
    this.lsDataFlag(options.type)
  },
  bindBack() {
    wx.navigateTo({
      url: 'view/view?type='+ this.data.type
    })
  },
  getData() {
    common.bankData(this.data.uid, this.data.token).then((res) => {
      this.lsDataFlag(res)
    })
  },
  // 判断
  lsDataFlag(type) {
    let flag = false
    if (type = 1) {
      flag = true
    }
    this.setData({
      bankFlag: flag,
      currentList: wx.getStorageSync('lsh_bankData'),
      type: type
    })
  },
  // 返回之后调
  onShow() {
    if (this.data.dataFlag){
      this.getData()
    }else{
      this.data.dataFlag = true
    }
  }
})