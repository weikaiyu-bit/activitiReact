import request from '@/utils/request';

const prefix = '/api/oa/admin/v1/TrainingRsMember';
const TrainingPlan = '/api/oa/admin/v1/TrainingPlan';
const PfilePersonnel = '/api/personnel/admin/v1/PfilePersonnel';
/*const PfilePersonnel = '/api/oa/personnel/admin/v1/PfilePersonnel';*/


export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

/* /api/oa/admin/v1/TrainingPlan/findPage */
export async function listTrainingPlan(params) {
  return request(`${TrainingPlan}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function listPfilePersonnel(params) {
  return request(`${PfilePersonnel}/find`, {
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

export async function removeByFileId(params) {
  return request(`${prefix}/deleteByFileId`, {
    method: 'POST',
    data: params,
  });
}
