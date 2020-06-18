import request from '@/utils/request';

const prefix = '/api/oa/jobcenter/admin/v1/JobTasks';
// 任务附件接口
const jobTaskFile = '/api/oa/jobcenter/admin/v1/JobRsTaskFile';
// 任务评论接口
const jobComments = '/api/oa/jobcenter/admin/v1/JobComments';
// 项目列表接口
const jobProjects = '/api/oa/jobcenter/admin/v1/JobProjects';
// 项目成员接口
const jobMembers = '/api/oa/jobcenter/admin/v1/JobMembers';
// 通讯录接口
const orgContacts = '/api/oa/organization/admin/v1/OrgContacts';
// 组织机构人员接口
const orgPerson = '/api/oa/organization/admin/v1/OrgPerson';
// 组织结构的接口
const orgOrganization = '/api/oa/organization/admin/v1/OrgOrganization';

export async function list(params) {
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

export async function listFiles(params) {
  return request(`${jobTaskFile}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function addFile(params) {
  params.id = 0;
  return request(`${jobTaskFile}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function removeFile(params) {
  return request(`${jobTaskFile}/delete`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function listComments(params) {
  return request(`${jobComments}/find`, {
    method: 'POST',
    data: params,
  });
}

// 获取树
export async function taskTree(params) {
  return request(`${prefix}/makeTree`, {
    method: 'POST',
    data: params,
  });
}

export async function projectList(params) {
  return request(`${jobProjects}/findAll`, {
    method: 'POST',
    data: params,
  });
}

export async function membersList(params) {
  return request(`${jobMembers}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function membersEditList(params) {
  return request(`${jobMembers}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function listContacts(params) {
  return request(`${orgContacts}/findPage`, {
    method: 'POST',
    data: params,
  });
}
export async function listOrgOrg(params) {
  return request(`${orgOrganization}/findAll`, {
    method: 'POST',
    data: params,
  });
}
export async function listOrgPerson(params) {
  return request(`${orgPerson}/findPage`, {
    method: 'POST',
    data: params,
  });
}
