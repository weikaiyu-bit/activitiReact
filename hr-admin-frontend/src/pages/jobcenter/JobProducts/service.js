import request from '@/utils/request';

const prefix = '/api/oa/jobcenter/admin/v1/JobProducts';
const prefixLog = '/api/oa/jobcenter/admin/v1/JobProductsLog';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function findById(params) {
  return request(`${prefix}/get?id=${params}`, {
    method: 'GET',
  });
}

export async function find(params) {
  return request(`${prefix}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function findProductLog(params) {
  return request(`${prefixLog}/find`, {
    method: 'POST',
    data: params,
  });
}
export async function addProductLog(params) {
  return request(`${prefixLog}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function add(params) {
  params.id = 0;
  return request(`${prefix}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  console.log('delete', params);
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
