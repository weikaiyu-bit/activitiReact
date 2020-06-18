import request from '@/utils/request';

const prefix = '/api/oa/bam/admin/v1/BamDictionary';
const tentant = '/api/oa/bam/admin/v1/BamTentants/findAll';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function findTentants(params) {
  return request(`${tentant}`, {
    method: 'POST',
    data: params,
  });
}

export async function add(params) {
  // params.id = 0;
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
