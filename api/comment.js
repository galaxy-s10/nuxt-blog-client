import request from './request'

export function commentlist(article_id) {
  return request({
    url: '/api/comment',
    method: 'get',
    params:{
      article_id
    }
  })
}
export function findmessage(data) {
  return request({
    url: '/api/message/find',
    method: 'get',
    params: {
      messageid: data
    }
  })
}
export function addcomment(data) {
  return request({
    url: '/api/comment/add',
    method: 'post',
    data
  })
}
export function addcommenta(data) {
  return request({
    url: '/api/message/addcomment',
    method: 'post',
    data
  })
}
export function editmessage(data) {
  return request({
    url: '/api/message/edit',
    method: 'post',
    data
  })
}
export function delmessage(messageid) {
  return request({
    url: '/api/message/del',
    method: 'get',
    params: {
      messageid
    }
  })
}
