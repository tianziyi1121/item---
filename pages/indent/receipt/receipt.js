const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    showpic: '',
    url: '',
    srcListData: [],
    saveSrc: '',
    deleteFlage: false,
    deleteShow: null,
    srcList: []
  },
  onLoad: function (options) {
    this.data.orderId = options.id
    this.getData()
  },
  getData() {
    api.requestServerData('/api/member/get_receipt_template', 'get', {
      uid: app.globalData.uid,
      token: app.globalData.token
    }, this.data.flag).then((res) => {
      if(res.data.status == 1){
        console.log(res)
        let data = res.data.data
        this.setData({
          showpic: data.pic.url,
          url: data.doc.url
        })
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 下载
  downlpoad() {
    wx.downloadFile({
      url: this.data.url,
      success(res) {
        if (res.statusCode === 200) {
          let url = res.tempFilePath
          wx.saveFile({
            tempFilePath: url, 
            success: function (res) {
              const savedFilePath = res.savedFilePath;
              toolTip.noPhotoTip('下载成功')
              console.log(res)
              wx.openDocument({
                filePath: savedFilePath,
                success: function (res) {

                },
              });
            }
          })
        }
      }
    })
  },
  // 查看
  bindCheck() {
    let array = []
    array.push(this.data.showpic)
    this.imageList(this.data.showpic, array)
  },
  // image list
  imageList(data, list){
    wx.previewImage({
      current: data,
      urls: list
    })
  },
  bindUpload(){
    let num = this.data.srcListData.length
    let self = this
    wx.chooseImage({
      count: 5 - num,
      sizeType: ['compressed', 'original'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        let i = 0
        self.uploadData(tempFilePaths, i, tempFilePaths.length)
      }
    })
  },
  // upload
  uploadData(data, i, length) {
    let self = this
    wx.uploadFile({
      url: 'https://www.rqxjzjxq.com/index.php/api/member/uploadfiles',
      filePath: data[i],
      name: 'pic',
      formData: {
        uid: app.globalData.uid,
        token: app.globalData.token,
        type: 1
      },
      success(resp) {
        let data = JSON.parse(resp.data)
        if (data.status == 1){
          self.data.srcListData.push("https://www.rqxjzjxq.com" + data.data)
          self.setData({
            srcListData: self.data.srcListData
          })
          self.data.srcList.push(data.data)
        }
        i == length - 1 ? toolTip.noPhotoTip('上传成功') : ''
      },
      complete: () => {
        i++;
        if (i < length) {
          self.uploadData(data, i, length);
        }
      },
    })
  },
  // 长按
  handleTouchStart(e) {
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
  imgYu(e) {
    let i = e.currentTarget.dataset.index
    if (this.endTime - this.startTime > 350) {
      return false;
    }
    this.imageList(this.data.srcListData[i], this.data.srcListData)
  },
  deleteData() {
    this.setData({
      src: ''
    })
    this.data.srcList = []
    this.cancel()
  },
  cancel() {
    this.setData({
      deleteShow: 1
    })
    setTimeout(() => {
      this.setData({
        deleteFlage: false,
        deleteShow: null
      })
    }, 700)
  },
  // save
  bindSave() {
    api.requestServerData('/api/member/savepics', 'post', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      pics: this.data.srcList,
      orderId: this.data.orderId,
      type: 1
    }, false).then((res) => {
      toolTip.noPhotoTip(res.data.msg)
      if(res.data.status == 1){
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})