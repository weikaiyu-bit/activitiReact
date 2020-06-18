import request from '@/utils/request';

const prefix = '/api/oa/minio/admin/v1/OssServer';

export async function list(params) {
  return request(`${prefix}/list`, {
    method: 'POST',
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
  // eslint-disable-next-line no-param-reassign
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

export async function getServer() {
  return request(`${prefix}/getServer`, {
    method: 'POST',
  });
}
