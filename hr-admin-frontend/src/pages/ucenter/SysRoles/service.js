import request from '@/utils/request';
import prefix from '@/dtsea/config/micro-prefix'

const SysRoles = `${prefix.ucenter}/SysRoles`;

// '/api/ucenter/admin/v1/findPage'
export async function list(params) {
  return request(`${SysRoles}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function add(params) {
  params.id = 0;
  return request(`${SysRoles}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  // console.log('params', params);
  return request(`${SysRoles}/update`, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(`${SysRoles}/delete`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function listFunctions() {
  return request(`${prefix.ucenter}/SysFunctions/findAll`, {
    method: 'POST',
  });
}
export async function listRsRoleFunc(params) {
  // console.log('params', params);
  return request(`${SysRoles}/findRsRoleFunc`, {
    method: 'POST',
    requestType: 'form', // 默认json
    data: params,
  });
}
export async function saveRoleFunc(params) {
  return request(`${SysRoles}/saveRoleFunc`, {
    method: 'POST',
    data: params,
  });
}
