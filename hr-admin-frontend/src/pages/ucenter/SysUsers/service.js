import request from '@/utils/request';
import prefix from '@/dtsea/config/micro-prefix'

const sysUsers = `${prefix.ucenter}/SysUsers`;

export async function list(params) {
  return request(`${sysUsers}/findPage`, {
    method: 'POST',
    // requestType: 'form', // 默认json
    data: params,
  });
}

export async function add(params) {
  params.id = 0;
  return request(`${sysUsers}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${sysUsers}/update`, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(`${sysUsers}/delete`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function resetPwd(params) {
  console.log(params)
  return request(`${sysUsers}/resetPwd`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function findRsUserRole(params) {
  console.log(params)
  return request(`${sysUsers}/findRsUserRole`, {
    method: 'POST',
    requestType: 'form', // 默认json
    data: params,
  });
}

export async function saveUserRole(params) {
  return request(`${sysUsers}/saveUserRole`, {
    method: 'POST',
    data: params,
  });
}

/*
 * ************************************************************
 * */

export async function listRoles() {
  // console.log('params', params)
  return request(`${prefix.ucenter}/SysRoles/findAll`, {
    method: 'POST',
    // requestType: 'form', // 默认json
    // data: params,
  });
}

// export async function listfindFunc() {
//   // console.log('params', params)
//   return request(`${prefix.ucenter}/SysFunctions/findAll`, {
//     method: 'POST',
//     // requestType: 'form', // 默认json
//     // data: params,
//   });
// }
