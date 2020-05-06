const app = getApp()
const api = require('../../../../utils/api.js')
const toolTip = require('../../../../utils/toolTip.js')
Page({
  data: {
    positionType: true,
    width: 200,
    hospitalName: '',
    currentList: [],
    form:{
      pat_name: '',
      pat_age: '',
      pat_description: '',
      hospital: '',
      departmentid: '',
      pat_sex: 1,
      orderId: ''
    }
  },
  onLoad: function (options) {
    this.data.form.uid = app.globalData.uid
    this.data.form.token = app.globalData.token
    this.data.form.orderId = options.id
  },
  // 数据
  bindView(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      ['form.'+ name]: e.detail.value
    })
  },
  // 性别
  bindSex(e) {
    this.setData({
      ['form.pat_sex']: e.currentTarget.dataset.num
    })
  },
  // 选择医院
  bindHosptail() {
    this.setData({
      positionType: false
    })
    this.shade()
  },
  // 科室确认
  onCalendarChange(e) {
    let name = e.detail.provinceName + e.detail.cityListName
    this.data.width = 0
    this.data.width = (name.length - 6) *23 + 200
    if (this.data.width > 476) {
      this.data.width = 476
    }
    this.setData({
      ['form.hospital']: e.detail.provinceNameId,
      ['form.departmentid']: e.detail.cityListId,
      hospitalName: e.detail.provinceName + e.detail.cityListName,
      loadingFlag: true,
      width: this.data.width
    })
    this.getHospital()
  },
  // 病情
  getHospital() {
    api.requestServerData('/api/Patient/bingqing', 'get', {
      department: this.data.form.departmentid,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, true).then((res) => {
      if(res.data.status == 1){
        res.data.data.bingqing.map(item => {
          this.data.currentList.push({
            name: item,
            flag: false
          })
        })
        this.setData({
          currentList: this.data.currentList
        })
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 动画 出现
  shade() {
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
    },100)
  },
  // 动画 消失
  unshade() {
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export()
    })
    this.data.positionType = true
    setTimeout(() => {
      this.setData({
        dialogShow: false,
        positionType: this.data.positionType
      })
    },300)
  },
  // 点击病情
  bindType(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.currentList
    let flag = false
    if (data[index].flag){
      flag = false
    }else{
      flag = true
    }
    this.setData({
      ['currentList[' + index + '].flag']: flag
    })
  },
  // 提交
  bnindSave() {
    let form = this.data.form
    this.data.currentList.map(item => {
      if(item.flag){
        form.pat_description = item.name + '，' + form.pat_description
      }
    })
    for(var key in form){
      if(!form[key]){
        toolTip.photoTip('数据不能为空', '../../../../static/fail.png')
        return false
      }
    }
    api.requestServerData('/api/Patient/patient_add', 'post', form, true).then((res) => {
      if(res.data.status == 1) {
        toolTip.photoTip('数据已保存', '')
        setTimeout(() => {
          wx.navigateTo({
            url: '../order',
          })
        },1000)
        
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 操作
  preventTouchMove() {
    // 有弹窗时，不让透过弹窗使页面滚动
  }

})