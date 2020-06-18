import request from '@/utils/request';

// 查询人事异动审核
const prefix = '/api/oa/admin/v1/PfileWorkRecord';
export async function list(params) {
    return request(`${prefix}/findPage`, {
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
    });
}
