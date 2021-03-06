import request from '@/utils/request';

const prefix = '/api/oa/bam/admin/v1/BamArea';

export async function list(params) {
  return request(`${prefix}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function clist(params) {
  return request(`${prefix}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function listpid(params) {
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
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
  });
}
