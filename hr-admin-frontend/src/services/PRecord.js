import request from '@/utils/request';

const prefix = '/api/oa/admin/v1/PfileWorkRecord';

const dictData = '/api/oa/bam/admin/v1/BamDictData';
export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function recoreChangeCode(params) {
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
    requestType: 'form',
    data: params,
  });
}

// 在职人员异动选拔方式
export async function recoreCategory(filter) {
  return request(`${dictData}/find`, {
    method: 'POST',
    data: filter,
  });
}