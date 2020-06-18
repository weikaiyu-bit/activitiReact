import request from '@/utils/request';
import { portMindlePrefix } from '@/pages/wfengine/config/portConfig';

const prefix = `${portMindlePrefix}/WfWorkflows`;

export async function get(params) {
  // console.log(params)
  return request.get(`${prefix}/get?id=${params.id}`);
}

export async function save(params) {
  // console.log(params)
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}
