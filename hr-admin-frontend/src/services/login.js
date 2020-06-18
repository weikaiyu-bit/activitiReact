import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  console.log('params=', params);

  return request('/api/oa/v1/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
