import request from '@/utils/request';

const prefix = '/api/personnel/admin/v1/PfilePersonnel';
// 组织机构
const org = '/api/oa/admin/v1/OrgOrganization';
// 职务信息
const workRecord = '/api/oa/admin/v1/PfileWorkRecord';
// 职务层次与职级层次
const positionLevel = '/api/personnel/admin/v1/PfilePositionLevel';
const technicalQualification = '/api/personnel/admin/v1/PfileProfessionalTechnicalQualification';
const educational = '/api/personnel/admin/v1/PfileEducational';
const exit = '/api/personnel/admin/v1/PfileExit';
const politicalStatus = '/api/personnel/admin/v1/PfilePoliticalStatus';

/*
查找组织结构
 */
export async function listOrgOrg(params) {
  return request(`${prefix}/findAllOrg`, {
    method: 'POST',
    data: params,
  });
}

export async function listWorkRecord(params) {
  return request(`${workRecord}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function updateWorkRecord(params) {
  return request(`${workRecord}/update`, {
    method: 'POST',
    data: params,
  });
}

export async function addWorkRecord(params) {
  params.id = 0;
  return request(`${workRecord}/addRecord`, {
    method: 'POST',
    data: params,
  });
}

export async function listOrg(params) {
  return request(`${org}/find`, {
    method: 'POST',
    data: params,
  });
}

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

// 查询职务层次与职务信息
export async function listPositionLevel(params) {
  return request(`${positionLevel}/find`, {
    method: 'POST',
    data: params,
  });
}

// 查询学历学位
export async function findEducational(params) {
  return request('/api/personnel/admin/v1/PfileEducational/find', {
    method: 'POST',
    data: params,
  });
}

// 查询考核信息
export async function findAnnualAppraisalNarrative(params) {
  return request('/api/personnel/admin/v1/PfileAnnualAppraisalNarrative/find', {
    method: 'POST',
    data: params,
  });
}

// 查询奖惩信息
export async function findRewardsPunishments(params) {
  return request('/api/personnel/admin/v1/PfileRewardsPunishments/find', {
    method: 'POST',
    data: params,
  });
}

// 查询家庭成员
export async function findFamilyRelations(params) {
  return request('/api/personnel/admin/v1/PfileFamilyRelations/find', {
    method: 'POST',
    data: params,
  });
}

// 查询专业技术任职资格信息
export async function listTechnicalQualification(params) {
  return request(`${technicalQualification}/findPage`, {
    method: 'POST',
    data: params,
  });
}

// 查询学历学位分页信息
export async function listEducational(params) {
  return request(`${educational}/findPage`, {
    method: 'POST',
    data: params,
  });
}

// 查询退出信息
export async function listExit(params) {
  return request(`${exit}/find`, {
    method: 'POST',
    data: params,
  });
}
// 查询政治面貌信息
export async function listPoliticalStatus(params) {
  return request(`${politicalStatus}/find`, {
    method: 'POST',
    data: params,
  });
}
