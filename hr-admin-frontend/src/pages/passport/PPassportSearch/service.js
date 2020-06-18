import request from '@/utils/request';

const prefix = '/api/oa/admin/v1/PassprotClaimRecord';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}
