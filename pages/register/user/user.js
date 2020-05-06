const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    url: '../../../static/icon_imgupload@2x.png',
    state: 1,
    // 所在地区
    regIndex: '1a0',
    positionFlag: true,
    area:null,
    // 所在医院科室
    hospital: [],
    hosIndex: '1a0',
    office: '',
    // class名绑定
    reuserWoman: 'reuser-woman',
    reuserMan: 'reuser-man',
    // 科室当前数据
    current: '',
    // 参数列表
    list: {
      uid: '',
      token: null
    },
    dataType: 1,
    // form数据
    form: {
      uid: '',
      token: 1,
      // 头像
      nursing_workers_headpic: null,
      // name
      nursing_workers_name: '',
      // phone
      nursing_workers_mobile: '',
      // idcode
      nursing_workers_idcard: '',
      // sex
      nursing_workers_sex: 2,
      // 年龄
      nursing_workers_age: null,
      // 工作年限
      nursing_workers_experience: '',
      // 省
      nursing_workers_province: '',
      // 市
      nursing_workers_city: '',
      // 县
      nursing_workers_town: '',
      // 医院
      nursing_workers_hospital: '',
      // 科室
      nursing_workers_departmentid: '',
      // 特长
      nursing_workers_speciality: '',
      // 简介
      nursing_workers_description: '',
      nursing_workers_live: '1',
      nursing_workers_danbao: '1',
      nursing_workers_healthy: '1',
      nursing_workers_violation : '1',
      // 来源
      member_list_from: "wechat"
    },
    // idcode
    num: 0,
    // position
    position: 0,
    // hospital
    hospitalAll: 0,
    positionType: false
  },
  onLoad: function (options) {
    this.data.list.uid = app.globalData.uid
    this.data.form.uid = app.globalData.uid
    this.data.list.token = app.globalData.token
    this.data.form.token = app.globalData.token
  }, 
  onShow(){
    let id = wx.getStorageSync('ls_optionsId')
    if (id == 1) {
      this.setData({
        form: app.globalData.userForm,
        area: app.globalData.area,
        office: app.globalData.office,
        ['form.nursing_workers_headpic']: app.globalData.image,
        state: 0
      })
      wx.removeStorageSync('ls_optionsId')
    }
  },
  // 上传头像
  bindGet() {
    var self = this
    app.globalData.userForm = this.data.form
    app.globalData.area = this.data.area
    app.globalData.office = this.data.office
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.navigateTo({
          url: '../../tailor/index?imgpage='+ res.tempFilePaths[0]
        })
      }
    })
  },
  // input
  userName(e) {
    let user = e.currentTarget.dataset.model 
    let number = e.detail.value
    if (user == 'nursing_workers_idcard' && number.length > 11){
      this.data.num = (number.length - 11) * 16
    }
    this.setData({
      num: this.data.num,
      ['form.' + user]: number
    })
  },
  // 选择
  userMon(e) {
    var user = e.currentTarget.dataset.item
    this.setData({
      ['form.' + user]: e.currentTarget.dataset.index
    })
  },
  // 所在地区/科室
  bindPosition(e) {
    this.setData({
      positionType: true
    })
    let index = e.currentTarget.dataset.index
    if (index == 5){
      this.data.dataType = 5
    }else{
      this.data.dataType = 3
    }
    this.setData({
      dataType: this.data.dataType,
      positionFlag: false
    })
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    this.animation = animation
    animation.translateY(0).step()
    setTimeout(() => {
      this.setData({
        animationData: this.animation.export()
      })
    },200)
  },
  unshade() {
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    this.animation = animation
    animation.translateY(306).step()
    this.setData({
      animationData: this.animation.export()
    })
    setTimeout(() => {
      this.setData({
        positionType: false,
        positionFlag: true
      })
    }, 300)
  },
  onCalendarChange(e) {
    if (this.data.dataType == 5){
      this.data.position = 0
      let area = e.detail.provinceName + e.detail.cityListName + e.detail.areaListName
      let number = area.length - 7
      for (var i = 0; i < number; i++){
        this.data.position += 28
      }
      this.setData({
        regIndex: 258,
        position: this.data.position,
        positionType: false,
        area: e.detail.provinceName + e.detail.cityListName + e.detail.areaListName,
        ['form.nursing_workers_province']: e.detail.provinceNameId,
        ['form.nursing_workers_city']: e.detail.cityListId,
        ['form.nursing_workers_town']: e.detail.areaListId
      })
    }else{
      let office = e.detail.provinceName + e.detail.cityListName
      let number = office.length - 7
      this.data.hospitalAll = 0
      for (var i = 0; i < number; i++) {
        this.data.hospitalAll += 28
      }
      this.data.hospitalAll > 280 ? this.data.hospitalAll = 280 : this.data.hospitalAll
      this.setData({
        hospitalAll: this.data.hospitalAll,
        hosIndex: 369,
        positionType: false,
        office: e.detail.provinceName + e.detail.cityListName,
        ['form.nursing_workers_hospital']: e.detail.provinceNameId,
        ['form.nursing_workers_departmentid']: e.detail.cityListId,
      })
    }
  },
  // textarea
  bindTextarea(e) {
    this.setData({
      ['form.'+e.target.dataset.model]: e.detail.value
    })
  },
  // 提交
  bindMessage: function() {
    let age = /^\d+(?=\.{0,1}\d+$|$)/ 
    let phone = /^[1][3,4,5,7,8][0-9]{9}$/
    for(var key in this.data.form){
      if (!this.data.form[key]){
        toolTip.photoTip('请填写完整信息', '../../../static/fail.png')
        return false
      }
    }
    this.idCode(this.data.form.nursing_workers_idcard).then((res) => {
      if (!res) {
        toolTip.photoTip('身份证号不正确', '../../../static/fail.png')
        return false
      } else if (!age.test(this.data.form.nursing_workers_age)) {
        toolTip.photoTip('请正确填写年龄', '../../../static/fail.png')
        return false
      } else if (!phone.test(this.data.form.nursing_workers_mobile)) {
        toolTip.photoTip('电话号码不正确', '../../../static/fail.png')
      }
      api.requestServerData('/api/nursing_workers/nursing_workers_register_submit', 'post', this.data.form, true).then((res) => {
        if (res.data.status == 1) {
          toolTip.photoTip('注册成功', '')
          wx.navigateTo({
            url: 'view/view?states=2'
          })
        } else if (res.data.status == 3) {
          toolTip.noPhotoTip(res.data.mssg)
        }
      })
    })
  },
  preventTouchMove() {},
  eimgcutcb: function (newimg) {
    this.setData({
      ['form.nursing_workers_headpic']: newimg,
    });
  },
  // 判断身份证号是否合法
  idCode(idcard) {
    let flag = false
    return new Promise((resolve, reject) => {
      idcard = typeof idcard === 'string' ? idcard : String(idcard);
      let regx = /^[\d]{17}[0-9|X|x]{1}$/;
      if (regx.test(idcard)) {
        let sevenTeenIndex = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        let front_seventeen = idcard.slice(0, 17);
        let eighteen = idcard.slice(17, 18);
        eighteen = isNaN(parseInt(eighteen)) ? eighteen.toLowerCase() : parseInt(eighteen);
        let remainder = 0;
        for (let i = 0; i < 17; i++) {
          remainder = (remainder += parseInt(front_seventeen.charAt(i)) * sevenTeenIndex[i]) % 11;
        }
        let remainderKeyArr = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let remainderKey = remainderKeyArr[remainder] === 'X' ? remainderKeyArr[remainder].toLowerCase() : remainderKeyArr[remainder];
        if (eighteen === remainderKey) {
          let day = Number(idcard.slice(12, 14));
          let mon = Number(idcard.slice(10, 12));
          if (day > 0 && day < 13 && mon > 0 && mon < 32) {
            flag = true
          } else {
            flag = false
          }
        }
      }
      resolve(flag)
    })
  }
})