import request from '@/utils/request';

const prefix = '/api/oa/admin/v1/OrgOrganization';
const dictData = '/api/oa/bam/admin/v1/BamDictData';
const bamarea = '/api/oa/bam/admin/v1/BamArea';
export async function list() {
    return request(`${prefix}/findAll`, {
        method: 'POST',
    });
}

export async function listByFilter(filter) {
    return request(`${prefix}/find`, {
        method: 'POST',
        data: filter,
    });
}

export async function listTenant(filter) {
    return request(`${prefix}/findTenant`, {
        method: 'POST',
        data: filter,
    });
}

export async function listDictData(filter) {
    return request(`${dictData}/find`, {
        method: 'POST',
        data: filter,
    });
}

export async function findBam(params) {
    return request(`${prefix}/findBam`, {
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
        requestType: 'form',
        data: params,
    });
}

// 所在政区  '/api/oa/bam/admin/v1/BamArea/listLikeArea'
export async function listLikeArea(params) {
    return request(`${bamarea}/listLikeArea`, {
        method: 'POST',
        data: params,
    });
}
