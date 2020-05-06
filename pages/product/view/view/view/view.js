const common = require('../../../../../utils/common.js')
const api = require('../../../../../utils/api.js')
const toolTip = require('../../../../../utils/toolTip.js')
const app = getApp()
Page({
  data: {
    shadowFlage: null,// shadow judge
    contentFlage: null,// content judge
    sort: 1,// title color change
    height: '',// window height
    // map 
    // current position
    markers: [],  
    mapNavigation: {},// map navigation
    // centre
    latitude: '',
    longitude: '',
    // collect
    collect: '../../../../../static/collect.png',
    collectBlack: '../../../../../static/collect_block.png',
    collectHalf: '../../../../../static/icon_star_on_half@2x.png',
    status: [0,1,2,3,4],
    collectData: 3.5,
    // server
    currentList: [],// current data list
    currentListPosition: '',// current location
    location: true,// location
    id: '',
    flag: true,// loading data
    p: 1,//data page
    cityList: [],
    cityData: [],
    provinceList: [],// city data
    province: '',// Province screening
    provinceName: '',// province name
    city: '',// city screening
    cityName: '',// city card
    cityFlag: true,
    comment: '',
    near: '',
    num: 0,
    loadingFlag: true,
    index: null,
    indexs: null,
    type: null,
    mapDataList: {},
    provinceId: null,
    sort3: true,
    selectIndex: 1,
    screenIndex: 0
  },
  onLoad: function (options) {
    this.noData = this.selectComponent("#noData")
    this.data.id = options.id
    this.setData({
      type: options.type
    })
    app.globalData.serviceName = ''
    app.globalData.serviceAddress = ''
    app.globalData.serviceId = ''
    this.windowHeight(options.type)
    this.currentPosition()
    this.getCityData()
  },
  // current data list
  getData(){
    api.requestServerData('/api/service/service_list', 'get', {
      zuobiao_lng1: this.data.longitude,
      zuobiao_lat1: this.data.latitude,
      p: this.data.p,
      province: this.data.province,
      city: this.data.city,
      near: this.data.near,
      comment: this.data.comment
    }, this.data.flag).then((res) => {
      let pn = this.data.p - 1
      this.data.currentList[pn] = []
      this.data.num = res.data.data
      if(res.data.status == 1) {
        res.data.data.map(item => {
          item.checked = false
        })
        this.setData({
          location: false,
          ['currentList[' + pn + ']']: res.data.data
        })
        this.getListData(this.data.currentList, this.data.sort)
        this.noData.noDataTrue()
      }else{
        if (this.data.p == 1) {
          this.setData({
            currentList: [],
            loadingFlag: true
          })
          this.noData.noData()
        } else {
          this.load.change();
        }
        this.data.num = 0
      }
    })
  },
  // get City data list
  getCityData(){
    return new Promise((resolve,reject) => {
      api.requestServerData('/api/service/region', 'get', '', true).then((res) => {
        if (res.data.status == 1) {
          this.setData({
            provinceList: res.data.data
          })
          this.data.cityList = res.data.data
          resolve(res.data.data)
        } else {
          toolTip.noPhotoTip('数据加载失败')
        }
      })
    })
    
  },
  // click on the title
  bindTitle(e) {
    let sort = e.currentTarget.dataset.order
    if (this.data.sort == sort && this.data.contentFlage) {
      this.setData({
        contentFlage: false
      })
      setTimeout(() => {
        this.setData({
          contentFlage: null,
          shadowFlage: false
        })
      }, 510)
      return false
    }
    this.data.sort = sort
    if(sort != 3){
      if (this.data.contentFlage) {
        this.setData({
          contentFlage: false
        })
        setTimeout(() => {
          this.setData({
            sort: sort,
            contentFlage: true
          })
        },510)
      }else{
        this.setData({
          shadowFlage: true
        })
        setTimeout(() => {
          this.setData({
            sort: sort,
            contentFlage: true
          })
        }, 310)
      }
      if (this.data.currentList.length == 0){
        this.noData.noData()
      }
    }else{
      if(!this.data.location){
        if (this.data.currentList.length > 0){
          this.getListData(this.data.currentList, sort)
        }else{
          this.setData({
            sort3: false,
            sort: sort
          })
          this.noData.noDataTrue()
        }
      }else{
        toolTip.noPhotoTip('请先进行位置授权')
      }
    }
  }, 
  getListData(data, sort) {
    let array = []
    data.map(item => {
      item.map(items => {
        array.push({
          iconPath: "../../../../../static/noPosition.png",
          id: items.id,
          latitude: items.zuobiao_lat,
          longitude: items.zuobiao_lng,
          name: items.name,
          address: items.address,
          logo: items.logo,
          distance: items.distance,
          comment_avg: items.comment_avg,
          width: 30,
          height: 30
        })
      })
    })
    array[0].iconPath = '../../../../../static/positionBlock.png'
    this.data.mapNavigation = array[0]
    if (this.data.contentFlage) {
      this.bindShadow()
    } else {
      let flag = true
      sort == 1 || sort == 2 ? flag = false : flag = true
      this.setData({
        sort: sort,
        sort3: flag
      })
    }
    this.setData({
      loadingFlag: true,
      mapDataList: array[0],
      markers: array
    })
    this.noData.noDataTrue()
  },
  // click on the province
  bindProvinceTitle(){
    this.setData({
      selectIndex: 1,
      provinceList: this.data.cityList
    })
    this.data.cityFlag = true
  },
  // click on the city title
  bindCityTitle() {
    this.setData({
      selectIndex: 2,
      provinceList: this.data.cityData
    })
    this.data.cityFlag = false
  }, 
  // click on the city list
  bindProvince(e) {
    let data = e.currentTarget.dataset
    let id = data.id
    let index = data.index
    let setData = this.data.cityList[index]
    if(!this.data.location){
      if (this.data.cityFlag) {
        this.setData({
          provinceName: setData.name,
          provinceList: setData.city,
          province: id,
          cityName: '',
          selectIndex: 2
        })
        this.data.cityFlag = false
      } else {
        this.data.cityData = this.data.provinceList
        common.getLat(this.data.provinceList[index].name+'市').then(res => {
          let data = res.result.location
          this.setData({
            longitude: data.lng,
            latitude: data.lat,
            cityName: this.data.provinceList[index].name,
            city: id
          })
          this.getData()
          this.bindShadow()
        })
      }
    }else{
      toolTip.noPhotoTip('请先进行位置授权')
    }
  },
  // click on the data list
  bindList(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'view/view?id=' + id + '&lng=' + this.data.longitude + '&lat=' + this.data.latitude + '&type=' + this.data.type,
    })
  },
  // click on the checkbox
  bindCheckbox(e) {
    let data = this.data.currentList
    let id = e.currentTarget.dataset.id
    if (this.data.index != null && this.data.index !== ''){
      this.setData({
        ['currentList[' + this.data.index + '][' + this.data.indexs + '].checked']: false
      })
    }
    let index = e.currentTarget.dataset.index
    let indexs = e.currentTarget.dataset.indexs
    let num = this.data.currentList[0].lengt
    if ((this.data.index != index && this.data.indexs != indexs) || (this.data.index === '' && this.data.indexs === '')){
      this.setData({
        ['currentList[' + index + '][' + indexs + '].checked']: true
      })
      this.data.index = index
      this.data.indexs = indexs
      app.globalData.serviceName = data[index][indexs].name
      app.globalData.serviceAddress = data[index][indexs].address
      app.globalData.serviceId = id
    }else{
      app.globalData.serviceName = ''
      app.globalData.serviceAddress = ''
      app.globalData.serviceId = ''
      this.data.index = ''
      this.data.indexs = ''
    }
  },
  // click submit order
  bindSubmitOrder(e) {
    let status = e.currentTarget.dataset.status
    let data = this.data.mapNavigation
    if(status != 3){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.openLocation({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude), 
        scale: 18, 
      })
    }
  },
  // click on the order
  bindScreen(e) {
    let data = e.currentTarget.dataset
    let name = data.name
    if(!this.data.location){
      if (name == 'near') {
        this.data.near = "distance_asc"
        this.data.comment = ""
      } else {
        this.data.near = ""
        this.data.comment = "comment_desc"
      }
      this.setData({
        screenIndex: data.type
      })
      this.getData()
      this.bindShadow()
    }else{
      toolTip.noPhotoTip('请先进行位置授权')
    }
  },
  bindShadow() {
    this.setData({
      contentFlage: false
    })
    setTimeout(() => {
      this.setData({
        contentFlage: null,
        sort: this.data.sort,
        shadowFlage: false
      })
    }, 510)
    setTimeout(() => {
      this.setData({
        shadowFlage: null
      })
    }, 810)
  },
  // window height
  windowHeight(type) {
    let height = common.windowHeight()
    type == 2 ? height = height - 82 : height = height - 182
    this.setData({
      height: height
    })
  },
  // Click registration point
  bindmarkertap(e) {
    let id = e.markerId
    let data = this.data.markers
    let i = null
    let j = null
    data.map((item,index) => {
      if (item.iconPath == '../../../../../static/positionBlock.png'){
        i = index
      } else if (id == item.id){
        j = index
        this.data.mapDataList = item
      }
    })
    if(j == null) return
    this.setData({
      ['markers[' + i + '].iconPath']: '../../../../../static/noPosition.png',
      ['markers[' + j + '].iconPath']: '../../../../../static/positionBlock.png',
      mapNavigation: this.data.mapDataList,
      mapDataList: this.data.mapDataList
    })
  },
  // 上拉加载
  onReady() {
    this.load = this.selectComponent("#load")
  },
  onReachBottom() {
    let flag = true
    if (this.data.sort != 3){
      if (this.data.num < 10) {
        this.load.change();
        flag = false
      }
      setTimeout(() => {
        this.setData({
          loadingFlag: false
        })
      }, 100)
      this.data.flag = false
      if (flag) {
        this.data.p += 1
        this.getData()
      }
    }
  },
  // current location
  currentPosition() {
    var self = this
    common.getUserLocation().then(res => {
      if(res == 1){
        common.getLocation().then(resp => {
          this.setData({
            location: false
          })
          resp.latitude = resp.latitude + 0.001276
          resp.longitude = resp.longitude + 0.006256
          common.getLocal(resp).then(resData => {
            let type = wx.getStorageSync('lf_positioningPrompt')
            let dataType = wx.getStorageSync('lf_positioningType')
            let dataData = resData.result.address_component
            this.setData({
              currentListPosition: resData.result.address
            })
            if ((type == 2 && dataType == 1) || (type == '' && dataType == '')) {
              this.getCityData().then(res => {
                res.map(item => {
                  if (dataData.province.indexOf(item.name) != -1) {
                    this.data.province = item.id
                    item.city.map(items => {
                      let city = wx.getStorageSync('lf_lon')
                      if (dataData.city.indexOf(items.name) != -1) {
                        this.data.city = items.id
                        this.setData({
                          latitude: resp.latitude,
                          longitude: resp.longitude
                        })
                        this.getData()
                      }
                    })
                  }
                })
              })
            } else if ((type == 2 && dataType == 2) || (type == 1 && dataType == '')) {
              this.data.province = wx.getStorageSync('lf_provinceId')
              this.getCityData().then(res => {
                res.map(item => {
                  if (item.id == this.data.province) {
                    item.city.map(items => {
                      let city = wx.getStorageSync('lf_lon')
                      if (items.name == city){
                        this.data.city = items.id
                        common.getLat(items.name+'市').then(ls_data => {
                          let setData = ls_data.result.location
                          this.setData({
                            latitude: setData.lat,
                            longitude: setData.lng
                          })
                          this.getData()
                        })
                      }
                    })
                  }
                })
              })
            }
          })
        })
      }
    }).catch(res => {
      if(res === 2){
        this.setData({
          currentList: [],
          location: true
        })
        this.noData.noData()
      }
    })
  }
})