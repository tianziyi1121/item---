const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    currentData: {},
    member_list_headpic: ''
  },
  onLoad: function (options) {
    app.globalData.userData.member_list_sex != 1 ? app.globalData.userData.member_list_sex = 2 : ''
    this.setData({
      currentData: app.globalData.userData
    })
  },
  onShow: function () {
    let id = wx.getStorageSync('ls_optionsId')
    if(id == 1) {
      this.setData({
        ['currentData.member_list_headpic']: "https://www.rqxjzjxq.com" + app.globalData.image
      })
      this.data.member_list_headpic = app.globalData.image
      wx.removeStorageSync('ls_optionsId')
    }
  },
  bindImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.navigateTo({
          url: '../../tailor/index?type=1&imgpage=' + res.tempFilePaths[0]
        })
      }
    })
  },
  // input data
  userDara(e) {
    let name = e.currentTarget.dataset.user
    this.setData({
      ['currentData.' + name]: e.detail.value,
    })
  },
  // sex
  bindSex(e) {
    let sex = e.currentTarget.dataset.type
    this.setData({
      ['currentData.member_list_sex']: sex
    })
  },
  // time
  bindDateChange(e) {
    this.setData({
      ['currentData.birthday']: e.detail.value
    })
  },
  bindSave() {
    let data = this.data.currentData
    api.requestServerData('/api/member/userinfo', 'post', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      member_list_headpic: data.member_list_headpic,
      member_list_nickname: data.member_list_nickname,
      member_list_sex: data.member_list_sex,
      // birthday: data.birthday,
      // signature: data.signature,
      name: data.name
    }, true).then((res) => {
      if(res.data.status == 1) {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
      toolTip.noPhotoTip(res.data.msg)
    })
  }
})