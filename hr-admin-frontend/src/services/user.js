import request from '@/utils/request';
import prefix from '@/dtsea/config/micro-prefix';

const user = `${prefix.oa}/User`;

export async function query() {
  console.log('query............');

  // return request('/api/users');

  const params = {};

  return request(`/api/oa/ucenter/v1/currentUser`, {
    method: 'POST',
    data: params,
  });
}
export async function queryCurrent() {
  const params = {};

  return request(`${user}/currentUser`, {
    // method: 'POST',
    data: params,
  });
}

export async function logout() {
  const params = {};
  return request(`${user}/logout`, {
    // method: 'POST',
    data: params,
  });
}


export async function queryNotices() {
  return request('/api/notices');
}
