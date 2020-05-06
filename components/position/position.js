const app = getApp()
const api = require('../../utils/api.js')
Component({
  properties: {
    typeNumber: {
      type: String// 5、地区，3、科室
    },
    dataType: {
      type: Number
    }
  },
  data: {
    currentIdx: 0,
    toView: 'a1',
    // 省份
    provinceList: [],
    provinceIndex: 40,
    provinceName: '',
    province: 0,
    provinceNameId: null,
    // 市
    cityList: [],
    cityListIndex: 30,
    cityListName: '',
    city: 0,
    showProvince: true,
    cityListId: null,
    // 区
    areaList: [],
    areaListIndex: 40,
    areaListName: '',
    showArea: false,
    areaListId: null,
    // 参数
    list: {
      uid: null,
      token: null
    },
    // 科室
    hospital: null,
    // 不限
    unlimited: [{id: '', pid: '',name: '不限'}]
  },
  attached: function () {
    let data = []
    if (this.properties.dataType != 1){
      data = this.data.unlimited
    }
    try {
      var value = wx.getStorageSync('position')
      if (value) {
        if (this.properties.typeNumber == 5){
          data = data.concat(value.data)
        }else{
          data = data.concat(value.hospital)
        }
        this.setData({
          provinceList: data
        })
      }else{
        this.getData()
      }
    } catch (e) {
      this.getData()
    }
  },
  methods: {
    // 获取列表数据
    getData() {
      this.data.list.uid = app.globalData.uid
      this.data.list.token = app.globalData.token
      api.requestServerData('/api/nursing_workers/nursing_workers_register','get',this.data.list,true).then((res) => {
        wx.setStorageSync('position', res.data)
        let data = []
        if (this.properties.dataType != 1) {
          data = this.data.unlimited
        }
        if (this.properties.typeNumber == 5) {
          data = data.concat(res.data.data)
        } else {
          data = data.concat(res.data.hospital)
        }
        this.setData({
          provinceList: data
        })
      })
    },
    // swiper
    _changeCurrent(e) {
      let index = e.detail.current
      this.setData({
        currentIdx: index
      })
    },
    // 点击省份
    _bindProvince(e) {
      let name = e.currentTarget.dataset.name
      let index = e.currentTarget.dataset.index
      this.data.provinceNameId = e.currentTarget.dataset.id
      let province = this.data.province + 1
      let cityList = null
      if (this.data.provinceNameId != ''){
        if (this.properties.typeNumber == 5) {
          cityList = this.data.provinceList[index].city
        } else {
          cityList = this.data.provinceList[index].department
        }
        if (province > 1) {
          this.data.cityListName = ''
          this.data.cityListIndex = 30
          this.data.areaListName = ''
          this.data.areaListIndex = 40
          this.data.showArea = false
        }
        this.setData({
          provinceName: name,
          cityList: cityList,
          provinceIndex: index,
          currentIdx: 1,
          province: this.data.province + 1,
          cityListName: this.data.cityListName,
          cityListIndex: this.data.cityListIndex,
          areaListName: this.data.areaListName,
          areaListIndex: this.data.areaListIndex,
          showArea: this.data.showArea,
          showProvince: true
        })
        return false
      }else{
        this.setData({
          provinceName: name,
          provinceIndex: index,
          currentIdx: 0,
          province: this.data.province + 1,
          cityListName: '',
          areaListName: '',
          showArea: false,
          showProvince: false
        })
        this.triggerEvent('calendarchange', {
          provinceName: this.data.provinceName,
          provinceNameId: this.data.provinceNameId,
        });
        this.triggerEvent('showTab');
      }
    },
    // 点击市
    _bindcity(e){
      let name = e.currentTarget.dataset.name
      let index = e.currentTarget.dataset.index
      let city = this.data.city + 1
      let areaList = null
      let showArea = false
      this.data.cityListId = e.currentTarget.dataset.id
      if (city > 1){
          this.data.areaListName = ''
          this.data.areaListIndex = 40
      }
      if (this.properties.typeNumber == 5) {
        areaList = this.data.cityList[index].town
        showArea = true
        this.setData({
          areaListName: this.data.areaListName,
          areaListIndex: this.data.areaListIndex,
          currentIdx: 2,
        })
      }
      this.setData({
        cityListName: name,
        areaList: areaList,
        cityListIndex: index,
        city: city,
        showArea: showArea
      })
      if (this.properties.typeNumber == 3){
        this.setData({
          currentIdx: 1,
        })
        this.triggerEvent('calendarchange', {
          provinceName: this.data.provinceName,
          cityListName: this.data.cityListName,
          provinceNameId: this.data.provinceNameId,
          cityListId: this.data.cityListId,
        });
        this.triggerEvent('showTab');
      }
    },
    // 点击县
    _bindArea(e) {
      let name = e.currentTarget.dataset.name
      let index = e.currentTarget.dataset.index
      this.setData({
        areaListName: name,
        areaListIndex: index,
      })
      this.triggerEvent('calendarchange', {
        provinceName: this.data.provinceName,
        cityListName: this.data.cityListName,
        areaListName: name,
        provinceNameId: this.data.provinceNameId,
        cityListId: this.data.cityListId,
        areaListId: e.currentTarget.dataset.id,
      }); 
      this.triggerEvent('showTab');
    },
    // 点击title
    _bindTileProvince(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        currentIdx: index
      })
    }
  }
})