import request from '@/utils/request';
import { portMindlePrefix } from '@/pages/wfengine/config/portConfig';

const prefix = `${portMindlePrefix}/WfWorkflows`;

const prefixNodeTemplate = `${portMindlePrefix}/WfNodeTemplates`;

const prefixNodes = `${portMindlePrefix}/WfNodes`;

export async function get(params) {
  // console.log(params)
  return request.get(`${prefix}/get?id=${params.id}`);
}

export async function save(params) {
  console.log(params)
  return request(`${prefix}/update`, {
    method: 'POST',
    data: params,
  });
}

export async function findNodeTemplate(params) {
  return request(`${prefixNodeTemplate}/find`, {
    method: 'POST',
    data: params,
  });
}
export async function addNodes(params) {
  return request(`${prefixNodes}/addNodes`, {
    method: 'POST',
    data: params,
  });
}
