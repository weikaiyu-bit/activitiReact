import request from '@/utils/request';

const WfNodes = '/api/wfengine/admin/v1/WfNodes';

export async function list() {
  return request(`${WfNodes}/findPage`, {
    method: 'POST',
  });
}

// 查找节点模板
export async function find() {
  return request(`${WfNodes}/findPage`, {
    method: 'POST',
  });
}
