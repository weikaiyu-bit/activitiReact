import request from 'umi-request';

const prefix = '/api/oa/admin/v1';

export async function getRoute() {
  return request(`${prefix}/menus`);
}
