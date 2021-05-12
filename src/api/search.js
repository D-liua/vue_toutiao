import request from '@/utils/request'

/**
 * 获取查询建议数据
 */
export const getSearchSuggestion = q => {
  return request({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取查询数据结果
 */
export const getSearchResult = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params
  })
}
