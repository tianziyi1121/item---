const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    showFlag: false,
    contentFlag: null,
    contentShow: null,
    // delete
    deleteFlage: false,
    deleteShow: null,
    dataList: [],
    imageList: [],
    // data index
    index: null
  },
  onLoad: function (options) {
    this.getData()
  },
  onShow: function () {

  },
  getData(){
    api.requestServerData('/api/member/pics_list', 'post', {
      uid: app.globalData.uid,
      token: app.globalData.token,
    }, true).then((res) => {
      if(res.data.status == 1){
        let data = res.data.data
        data.map(item => {
          this.data.dataList.push("https://www.rqxjzjxq.com" + item)
        })
        this.data.dataList.length == 9 ? this.data.imageFlag = false : this.data.imageFlag = true
        this.setData({
          dataList: this.data.dataList,
          imageFlag: this.data.imageFlag
        })
        this.data.imageList = res.data.data
      }
    })
  },
  uploading() {
    this.setData({
      contentFlag: 1,
      contentShow: 1,
      showFlag: true
    })
  },
  cancel (){
    console.log(1)
    this.setData({
      contentFlag: 2,
      contentShow: 2
    })
    setTimeout(() => {
      this.setData({
        showFlag: false,
      })
    },700)
  },
  cancelImage() {
    this.setData({
      deleteShow: 1
    })
    setTimeout(() => {
      this.setData({
        deleteFlage: false,
      })
    }, 500)
  },
  // 相册||拍摄
  photoAlbum (e) {
    let data = e.currentTarget.dataset.type
    let self = this
    let num = 9 - this.data.dataList.length
    this.cancel()
    wx.chooseImage({
      count: num,
      sizeType: ['compressed', 'original'],
      sourceType: [data], 
      success(res) {
        let tempFilePaths = res.tempFilePaths
        var length = res.tempFilePaths.length
        var i = 0
        self.uploadDIY(res.tempFilePaths, i, length)
      }
    })
  },
  // 上传
  uploadDIY(data, i, length) {
    let self = this
    wx.uploadFile({
      url: 'https://www.rqxjzjxq.com/index.php/api/member/uploadfiles',
      filePath: data[i],
      name: 'pic',
      formData: {
        uid: app.globalData.uid,
        token: app.globalData.token,
        type: 2
      },
      success(resp) {
        let data = JSON.parse(resp.data)
        if (data.status == 1) {
          self.data.dataList.push("https://www.rqxjzjxq.com" + data.data)
          self.data.imageList.push(data.data)
          self.data.dataList.length == 9 ? self.data.imageFlag = false : self.data.imageFlag = true
          self.setData({
            dataList: self.data.dataList,
            imageFlag: self.data.imageFlag
          })
          i == length - 1 ? toolTip.noPhotoTip('上传成功') : ''
        } else {
          toolTip.noPhotoTip(data.msg)
        }
      },
      complete: () => {
        i++;
        if (i < length) {
          this.uploadDIY(data, i, length);
        }
      },
      fail() {
        toolTip.noPhotoTip("上传失败")
      }
    })
  },
  // 长按
  handleTouchStart(e){
    this.startTime = e.timeStamp;
  },
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bindDelecct(e) {
    this.setData({
      deleteFlage: true,
      deleteShow: 2
    })
    this.data.index = e.currentTarget.dataset.index
  },
  deleteData(){
    this.cancelImage()
    this.data.dataList.splice(this.data.index, 1)
    this.data.dataList.length >= 9 ? this.data.imageFlag = false : this.data.imageFlag = true
    this.setData({
      dataList: this.data.dataList,
      imageFlag: this.data.imageFlag
    })
    this.data.imageList.splice(this.data.index, 1)
    this.save()
  },
  //图片点击事件
  imgYu(event) {
    if (this.endTime - this.startTime > 350) {
      return false;
    }
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.dataList
    })
  },
  // save
  save() {
    api.requestServerData('/api/member/savepics', 'post', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      pics: this.data.imageList,
      type: 2,
      orderId: ''
    }, false).then((res) => {
      toolTip.noPhotoTip(res.data.msg)
    })
  }
})