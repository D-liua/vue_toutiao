// import store from '@/store'

/**
 *  用户相关请求模块
 */
import request from '@/utils/request'

export const login = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}

/**
 * 发送验证码
 * 注意: 每个手机号每分钟只能发送一次
 */
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户自己的信息
 */

export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
    // headers: {
    //   // Bearer后面有个空格 多了少了都不行
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/**
 * 获取用户频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

/**
 * 关注用户
 */
export const addFollow = userId => {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

/**
 * 获取用户资料
 */
export const getUserProfile = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}

/**
 * 修改用户资料
 */
export const editUserProfile = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/profile',
    data
  })
}

/**
 * 修改用户头像
 */
export const updatePhoto = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/photo',
    data
  })
}

// /**
//  * 获取用户个人资料
//  */
// export const getUserProfile = () => {
//   return request({
//     method: 'GET',
//     url: '/app/v1_0/user/profile'
//   })
// }

// /**
//  * 修改用户个人资料
//  */
// export const updateUserProfile = data => {
//   return request({
//     method: 'PATCH',
//     url: '/app/v1_0/user/profile',
//     data
//   })
// }

// /**
//  * 修改用户照片资料
//  */
// export const updateUserPhoto = data => {
//   return request({
//     method: 'PATCH',
//     url: '/app/v1_0/user/photo',
//     data
//   })
// }
