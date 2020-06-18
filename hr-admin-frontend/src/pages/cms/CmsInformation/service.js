import request from '@/utils/request';

const prefix = '/api/oa/cms/admin/v1/CmsContent';

const category = '/api/oa/cms/admin/v1/CmsCategory';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function categorylist(params) {
  return request(`${category}/findAll`, {
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
    requestType: 'form',
    data: params,
  });
}
