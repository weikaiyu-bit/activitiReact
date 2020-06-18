import request from '@/utils/request';

const prefix = '/api/oa/jobcenter/admin/v1/JobProjects';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function findByProjectId(params) {
  return request(`${prefix}/get?id=${params}`, {
    method: 'GET',
  });
}
// 查找附件
export async function findAnnex(params) {
  return request(`${prefix}/findAnnex`, {
    method: 'POST',
    data: params,
  });
}

// 查找任务动态
export async function findLog(params) {
  return request(`${prefix}/findLog`, {
    method: 'POST',
    data: params,
  });
}

// 查找项目动态
export async function findProjectRecord(params) {
  return request(`${prefix}/findProjectRecord`, {
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
