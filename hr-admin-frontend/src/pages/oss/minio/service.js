/* eslint-disable no-param-reassign */
import request from '@/utils/request';

const prefix = '/api/oa/minio/admin/v1/OssMinio';

export async function list(params) {
  return request(`${prefix}/list`, {
    method: 'POST', // 默认json
    data: params,
  });
}

export async function remove(params) {
  return request(`${prefix}/delete`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function add(params) {
  params.id = 0;
  return request(`${prefix}/save`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${prefix}/save`, {
    method: 'POST',
    data: params,
  });
}
