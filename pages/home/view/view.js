const app = getApp();
const common = require('../../../utils/common.js')
const toolTip = require('../../../utils/toolTip.js')
const api = require('../../../utils/api.js')
Page({
  data: {
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    currentList: [],
    cityCurrentList: [],
    provinct: '',
    provinceId: '',
    cityData: '',
    index: null,
    selectIndex: 1
  },
  onShow: function () {
    this.getPosition()
    this.getData()
  },
  // bind Province
  bindProvince() {
    this.setData({
      selectIndex: 1,
      currentList: this.data.cityCurrentList
    })
  },
  // bindCityData
  bindCityData() {
    this.setData({
      selectIndex: 2,
      currentList: this.data.cityCurrentList[this.data.index].city
    })
  },
  getPosition() {
    var self = this
    common.getUserLocation().then(res => {
      if (res == 1) {
        common.getLocation().then(resp => {
          resp.latitude = resp.latitude + 0.001276
          resp.longitude = resp.longitude + 0.006256
          common.getLocal(resp).then(resData => {
            this.setData({
              latitude: resp.latitude,
              longitude: resp.longitude,
              currentListPosition: resData.result.address,
              city: resData.result.address_component.city
            })
          })
        })
      }
    })
  },
  // location
  getData(){
    api.requestServerData("/api/service/region", "get", '', false).then((res) => {
      if(res.data.status == 1){
        this.setData({
          currentList: res.data.data
        })
        this.data.cityCurrentList = res.data.data
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // bind location
  baindLocation(e){
    let data = e.currentTarget.dataset
    let id = data.id
    let index = data.index
    let pid = data.pid
    this.data.index = data.index
    if (pid == 1){
      this.data.provinceId = id
      wx.setStorageSync('lf_provinceId', id)
      this.setData({
        selectIndex: 2,
        province: data.name,
        currentList: this.data.cityCurrentList[index].city
      })
      
    }else{
      this.setData({
        city: data.name,
        cityData: data.name
      })
      wx.setStorageSync('lf_lon', this.data.city)
      wx.navigateBack({
        delta: 1
      })
      wx.setStorageSync('lf_positioningPrompt', 1)
      wx.removeStorageSync('lf_positioningType')
    }
  },
  bindCity(){
    wx.removeStorageSync('lf_positioningPrompt')
    wx.removeStorageSync('lf_positioningType')
    wx.navigateBack({
      delta: 1
    })
    wx.setStorageSync('lf_lon', this.data.city)
  }
})
