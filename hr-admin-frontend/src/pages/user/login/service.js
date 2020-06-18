import request from '@/utils/request';
import prefix from '@/dtsea/config/micro-prefix'

const User = `${prefix.oa}/User`;

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function login(params) {
  return request(`${User}/login`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
