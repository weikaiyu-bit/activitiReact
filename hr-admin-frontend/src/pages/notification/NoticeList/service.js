import request from '@/utils/request';

const prefix = '/api/oa/notification/v1';


export async function getNewestRemind (params) {
  return request(`${prefix}/getNewestRemind`, {
    method: 'POST',
    data: params,
  });
}

export async function createAnnounce (params) {
  params.id = 0;
  return request(`${prefix}/createAnnounce`, {
    method: 'POST',
    data: params,
  });
}

export async function createRemind (params) {
  params.id = 0;
  return request(`${prefix}/createRemind`, {
    method: 'POST',
    data: params,
  });
}

export async function createMessage (params) {
  params.id = 0;
  return request(`${prefix}/createMessage`, {
    method: 'POST',
    data: params,
  });
}

export async function pullAnnounce (params) {
  return request(`${prefix}/pullAnnounce?uid=${params.uid}`, {
    method: 'GET',
  });
}

export async function pullRemind (params) {
  return request(`${prefix}/pullRemind?uid=${params.uid}`, {
    method: 'GET',
  });
}

export async function read (params) {
  return request(`${prefix}/read`, {
    method: 'POST',
    data: params,
  });
}

export async function getUserNotify (params) {
  return request(`${prefix}/getUserNotify`, {
    method: 'GET',
    data: params,
  });
}

export async function subscribe (params) {
  return request(`${prefix}/subscribe`, {
    method: 'POST',
    data: params,
  });
}

export async function cancelSubscription (params) {
  return request(`${prefix}/cancelSubscription`, {
    method: 'POST',
    data: params,
  });
}

export async function getSubscriptionConfig (params) {
  return request(`${prefix}/getSubscriptionConfig`, {
    method: 'POST',
    data: params,
  });
}

export async function updateSubscriptionConfig (params) {
  return request(`${prefix}/updateSubscriptionConfig`, {
    method: 'POST',
    data: params,
  });
}

export async function list (params) {
  return request('/api/oa/notification/admin/v1/MsgNotify/findAll', {
    method: 'POST',
    data: params,
  });
}
// 查询用户信息条目
export async function query (params) {
  return request('/api/oa/notification/admin/v1/MsgUserNotify/findPage', {
    method: 'POST',
    data: params,
  });
}
