module.exports.photoTip = function (title,img) {
  wx.showToast({
    title: title,
    icon: 'success',
    image: img,
    duration: 3000
  })
}
module.exports.noPhotoTip = function (title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 3000
  })
}