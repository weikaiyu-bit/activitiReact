import request from '@/utils/request';
import { portMindlePrefix } from '@/pages/wfengine/config/portConfig';

const prefix = `${portMindlePrefix}/WfWorkflowCategories`;

export async function list(params) {
  return request(`${prefix}/find`, {
    method: 'POST',
    data: params,
  });
}

export async function findAll() {
  return request(`${prefix}/findAll`, {
    method: 'POST',
  });
}

export async function maketree(params) {
  return request(`${prefix}/tree`, {
    method: 'POST',
    data: params,
  });
}

export async function treeMenu(params) {
  return request(`${prefix}/treeMenu`, {
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
