import request from '@/utils/request';

const profix = "/api/process/newTheBill";
export async function list(params) {
    return request(profix, {
        method: 'POST',
        data: params,
    });
}
export async function add(params) {
    return request(profix, {
        method: 'POST',
        data: params,
    });
}

export async function update(params) {
    return request(profix, {
        method: 'POST',
        data: params,
    });
}
export async function remove(params) {
    return request(profix, {
        method: 'POST',
        data: params,
    });
}
