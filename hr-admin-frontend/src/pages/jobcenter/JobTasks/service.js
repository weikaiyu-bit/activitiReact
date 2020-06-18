import request from '@/utils/request';

const prefix = '/api/oa/jobcenter/admin/v1/JobTasks';
// 任务附件接口
const jobTaskFile = '/api/oa/jobcenter/admin/v1/JobRsTaskFile';
const projectFile = '/api/oa/jobcenter/admin/v1/JobProjects';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}
// 搜索所有项目
export async function findProject() {
  return request('/api/oa/jobcenter/admin/v1/JobProjects/findAll', {
    method: 'POST',
  });
}
// 项目生成树控件
export async function makeTreeProject(params) {
  return request(`${projectFile}/makeTree`, {
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
// 搜索项目成员
export async function findJobMembers(params) {
  return request('/api/oa/jobcenter/admin/v1/JobMembers/find', {
    method: 'POST',
    data: params,
  });
}
// 搜索任务成员
export async function findJobRsTaskUser(params) {
  return request('/api/oa/jobcenter/admin/v1/JobRsTaskUser/find', {
    method: 'POST',
    data: params,
  });
}
// 添加任务成员
export async function addJobRsTaskUser(params) {
  return request('/api/oa/jobcenter/admin/v1/JobRsTaskUser/add', {
    method: 'POST',
    data: params,
  });
}
// 修改任务成员
export async function updataJobRsTaskUser(params) {
  return request('/api/oa/jobcenter/admin/v1/JobRsTaskUser/update', {
    method: 'POST',
    data: params,
  });
}
// 删除任务成员
export async function removeJobRsTaskUser(params) {
  return request('/api/oa/jobcenter/admin/v1/JobRsTaskUser/delete', {
    method: 'POST',
    data: params,
    requestType: 'form',
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

export async function fetchTask(params) {
  return request(`${prefix}/find`, {
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

export async function listFiles(params) {
  return request(`${jobTaskFile}/find`, {
    method: 'POST',
    data: params,
  });
}
