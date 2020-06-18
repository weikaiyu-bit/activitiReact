import request from '@/utils/request';
import { portMindlePrefix } from '@/pages/wfengine/config/portConfig';

const prefix = `${portMindlePrefix}/WfNodes`;

export async function list(params) {
  return request(`${prefix}/findPageCustom`, {
    method: 'POST',
    data: params,
  });
}

export async function findAll() {
  return request(`${prefix}/findAll`, {
    method: 'POST',
  });
}

export async function add(params) {
  return request(`${prefix}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function addNodes(params) {
  return request(`${prefix}/addNodes`, {
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
