import request from '@/utils/request';

const prefix = '/api/notification/admin/v1/MsgNotifyConfig';
const targetTypes = '/api/notification/admin/v1/MsgTargetTypes';
export async function list(params) {
  return request(`${targetTypes}/findns`, {
    method: 'POST',
    data: params,
  });
}

export async function find(params) {
  return request(`${prefix}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function findAll() {
  return request(`${prefix}/findAll`, {
    method: 'POST',
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
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
    requestType: 'json',
  });
}

export async function listTargetTypes(params) {
  return request('/api/notification/admin/v1/MsgTargetTypes/findPage', {
    method: 'POST',
    data: params,
  });
}
