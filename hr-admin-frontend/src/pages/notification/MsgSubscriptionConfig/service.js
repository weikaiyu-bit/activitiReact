import request from '@/utils/request';

const prefix = '/api/notification/admin/v1/MsgSubscriptionConfig';

export async function list(params) {
  return request(`${prefix}/findPage`, {
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
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
