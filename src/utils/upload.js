
// 上传单个文件
const uploadFile = (cloudPath, filePath) => {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: function (res) {
        resolve(res.fileID)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
// 获取链接地址
const getUrl = ids => {
  wx.showLoading({
    title: `正在获取链接地址`,
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.cloud.getTempFileURL({
      fileList: ids,
      success: function ({ fileList }) {
        resolve(
          fileList.map(item => {
            return {
              id: item.fileID,
              url: item.tempFileURL
            }
          })
        )
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
const getFileName = name => {
  // return name
  name = name.replace(/^\s+|\s+$/, '').replace(/\s+/g, '_')
  const arr = name.split('.').reverse()
  return `${arr[1].replace(/[/:]/g, '')}.${arr[0]}`
}

const uploadImg = filePaths => {
  const ids = []
  // 上传图片
  let resolve = Promise.resolve()
  for (let i = 0; i < filePaths.length; i++) {
    resolve = resolve.then(() => {
      const cloudPath = `photo/${getFileName(filePaths[i])}`
      const path = filePaths[i]
      if (i === 0) {
        wx.showLoading({
          title: `正在上传第1张图片`,
          mask: true
        })
      }
      return uploadFile(cloudPath, path)
        .then(id => {
          wx.showLoading({
            title: `正在上传第${i + 1}张图片`,
            mask: true
          })
          ids.push(id)
        })
        .catch(_ => {
          wx.showToast({
            title: `error`,
            icon: 'none'
          })
        })
    })
  }

  // 获取真实链接地址
  resolve = resolve.then(() => {
    wx.hideLoading()
    return ids
  })

  return resolve
}

const delImg = id => {
  // 修改数据库
  /* let page = getCurrentPages()
  page = page[page.length - 1]
  let { $photos } = page.data
  $photos = $photos.filter(item => item.id !== id) */
  del([id]).catch(null)
}
const del = ids => {
  return new Promise((resolve, reject) => {
    wx.cloud.deleteFile({
      fileList: ids,
      success: function ({ fileList }) {
        resolve(fileList.map(item => item.fileID))
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

const uploadMusic = (name, filePath) => {
  const fileName = getFileName(name)
  const cloudPath = `music/${fileName}`
  wx.showLoading({
    title: `上传中...`,
    mask: true
  })
  return uploadFile(cloudPath, filePath)
    .then(id => {
      // 获取链接地址
      return getUrl([id])
    })
    .then(res => {
      const music = res[0]
      return music.url
    })
    .then(res => {
      wx.showToast({
        title: '上传成功！',
        icon: 'none'
      })
      return res
    })
    .catch(err => {
      wx.hideLoading()
      console.log(err)
    })
}

const uploadBackground = filePath => {
  const fileName = getFileName(filePath)
  const cloudPath = `background/${fileName}`
  wx.showLoading({
    title: `上传中...`,
    mask: true
  })
  return uploadFile(cloudPath, filePath)
    .then(id => {
      // 获取链接地址
      return getUrl([id])
    })
    .then(res => {
      return res[0].url
    })
    .then(res => {
      wx.showToast({
        title: '上传成功！',
        icon: 'none'
      })
      return res
    })
    .catch(err => {
      wx.hideLoading()
      console.log(err)
    })
}

export default {
  uploadImg,
  delImg,
  uploadMusic,
  uploadBackground
}
