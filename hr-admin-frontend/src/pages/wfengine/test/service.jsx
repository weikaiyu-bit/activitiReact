import request from '@/utils/request';

const prefix = '/api/wfengine/admin/v1/WfWorkflows';

export async function get(params) {
  // console.log(params)
  return request.get(`${prefix}/get?id=${params.id}`);
}
