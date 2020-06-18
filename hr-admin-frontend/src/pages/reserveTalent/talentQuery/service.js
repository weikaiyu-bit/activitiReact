import request from '@/utils/request';

const prefix = '/api/personnel/admin/v1/PfilePersonnel';
const org = '/api/oa/admin/v1/RtCategory';
/*
查找组织结构
 */
export async function listOrgOrg (params) {
  return request(`${prefix}/findAllOrg`, {
    method: 'POST',
    data: params,
  });
}

export async function listOrg (params) {
  return request(`${org}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function list (params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function add (params) {
  params.id = 0;
  return request(`${prefix}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update (params) {
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}


export async function remove (params) {
  return request(`${prefix}/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 查询职务信息
export async function findPositionLevel (params) {
  return request('/api/personnel/admin/v1/PfilePositionLevel/find', {
    method: 'POST',
    data: params,
  });
}

// 查询学历学位
export async function findEducational (params) {
  return request('/api/personnel/admin/v1/PfileEducational/find', {
    method: 'POST',
    data: params,
  });
}

// 查询考核信息
export async function findAnnualAppraisalNarrative (params) {
  return request('/api/personnel/admin/v1/PfileAnnualAppraisalNarrative/find', {
    method: 'POST',
    data: params,
  });
}

// 查询奖惩信息
export async function findRewardsPunishments (params) {
  return request('/api/personnel/admin/v1/PfileRewardsPunishments/find', {
    method: 'POST',
    data: params,
  });
}

// 查询家庭成员
export async function findFamilyRelations (params) {
  return request('/api/personnel/admin/v1/PfileFamilyRelations/find', {
    method: 'POST',
    data: params,
  });
}
