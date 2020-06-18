import request from '@/utils/request';

const prefix = '/api/oa/jobcenter/admin/v1/JobComments';

export async function list(params) {
  return request(`${prefix}/findPage`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchCommentPage(params) {
  console.log(params);
  return request(`${prefix}/findCommentPage`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchReplyCommentPage(params) {
  console.log(params);
  return request(`${prefix}/findCommentChildrenPage`, {
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
