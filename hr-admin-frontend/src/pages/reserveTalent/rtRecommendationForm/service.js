import request from '@/utils/request';

const prefix = '/api/oa/admin/v1/RtRecommendationForm';
const dictData = '/api/oa/bam/admin/v1/BamDictData';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function listDictData(filter) {
  return request(`${dictData}/find`, {
      method: 'POST',
      data: filter,
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

