import request from '@/utils/request';

const prefix = '/api/notification/admin/v1/MsgUserNotify';

export async function list(params) {
  return request(`${prefix}/findPage`, {
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

export async function add(params) {
  params.id = 0;
  return request(`${prefix}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  console.log(params)
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}


export async function remove(params) {
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
