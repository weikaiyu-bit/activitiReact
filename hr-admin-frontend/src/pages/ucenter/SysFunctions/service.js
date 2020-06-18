import request from '@/utils/request';
import prefix from '@/dtsea/config/micro-prefix'

const SysFunctions = `${prefix.ucenter}/SysFunctions`;

export async function list (params) {
  return request(`${SysFunctions}/findAll`, {
    method: 'POST',
    requestType: 'json',
    data: params,
  });
}

export async function add (params) {
  params.id = 0;
  return request(`${SysFunctions}/add`, {
    method: 'POST',
    data: params,
  });
}

export async function update (params) {
  return request(`${SysFunctions}/update`, {
    method: 'POST',
    data: params,
  });
}

/* /api/ucenter/admin/v1/SysFunctions/delete   555 */
export async function remove (params) {
  return request(`${SysFunctions}/delete`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
