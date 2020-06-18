import request from '@/utils/request';

const prefix = '/api/notification/admin/v1/MsgTargetTypes';

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
// 生成树
export async function makeTree(params) {
  return request(`${prefix}/makeTree`, {
    method: 'POST',
    data: params,
  });
}
export async function findAll() {
  return request(`${prefix}/findAll`, {
    method: 'POST',
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
