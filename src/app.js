import log from '/utils/log.js'
App({
  todos: [
    { text: 'Learning Javascript', completed: true },
    { text: 'Learning ES2016', completed: true },
    { text: 'Learning 支付宝小程序', completed: false }
  ],

  userInfo: null,
  onLaunch() {
    log.info('App Launch')
  },
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo)
      /* #ifdef alipay */
      my.getAuthCode({
        scopes: ['auth_user'],
        success: (authcode) => {
          console.info(authcode)

          my.getAuthUserInfo({
            success: (res) => {
              this.userInfo = res
              resolve(this.userInfo)
            },
            fail: () => {
              reject({})
            }
          })
        },
        fail: () => {
          reject({})
        }
      })
      /* #endif */
      /* #ifdef wechat */
      wx.login({
        success: (res) => {
          console.info(res)
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
              resolve(this.userInfo)
            },
            fail: () => {
              reject({})
            }
          })
        },
        fail: () => {
          reject({})
        }
      })
      /* #endif */
    })
  }
})
