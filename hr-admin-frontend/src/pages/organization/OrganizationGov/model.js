import { list, add, update, remove, listByFilter, findBam, listTenant, listDictData, listLikeArea } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
    namespace: 'organizationGovModel',
    state: {
        data: [],
        total: 0,
    },

    /**
     * 异步请求 *************************************************************************************
     * */

    effects: {
        * fetch(_, { call, put }) {
          const response = yield call(list);
            console.log('response', response);
            yield put({
                type: 'list',
                payload: {
                    params: response,
                },
            });
        },

        * fetchOrgLevel({ payload }, { call, put }) {
            const response = yield call(listDictData, payload);
            console.log('orgLevel', payload);
            yield put({
                type: 'listOrgLevel',
                payload: {
                    params: response,
                },
            });
        },

        * fetchOrgCategory({ payload }, { call, put }) {
            const response = yield call(listDictData, payload);
            console.log('OrgCategory', payload);
            yield put({
                type: 'listOrgCategory',
                payload: {
                    params: response,
                },
            });
        },

        // 查询隶属关系
        * fetchSubjection({ payload }, { call, put }) {
            const response = yield call(listDictData, payload);
            console.log('fetchSubjection·······································', response);
            yield put({
                type: 'Subjection',
                payload: {
                    params: response,
                },
            });
        },

        * fetchByFilter({ payload }, { call, put }) {
            const response = yield call(listByFilter, payload);
            yield put({
                type: 'list',
                payload: {
                    params: response,
                    // filter: payload,
                },
            });
        },

        // 所在政区
        * fetchArea({ payload }, { call, put }) {
            const response = yield call(listLikeArea, payload);
            yield put({
                type: 'area',
                payload: {
                    params: response,
                    // filter: payload,
                },
            });

        },

        * fetchlistTenant({ payload }, { call, put }) {
            const response = yield call(listTenant, payload);
            yield put({
                type: 'tenant',
                payload: {
                    params: response,
                    // filter: payload,
                },
            });
        },
        * fetchProvince({ payload, callback }, { call, put }) {
            const response = yield call(findBam, payload);
            console.log('response', response)
            if (callback) callback(response);
            yield put({
                type: 'province',
                payload: {
                    params: response,
                },
            });
        },
        * add({ payload, callback }, { call, put, select }) {
            const response = yield call(add, payload);
            if (callback) callback(response);
            if (response.code === 0) {
                const { params } = yield select(state => state.organizationGovModel);
                yield put({ type: 'fetch', payload: params });
            }
        },
        * update({ payload, callback }, { call, put, select }) {
            const response = yield call(update, payload);
            console.log('update', response);
            if (callback) callback(response);
            if (response.code === 0) {
                const { params } = yield select(state => state.organizationGovModel);
                yield put({ type: 'fetch', payload: params });
            }
        },
        * remove({ payload, callback }, { call, put, select }) {
            const response = yield call(remove, payload);
            if (callback) callback(response);
            if (response.code === 0) {
              const { params } = yield select(state => state.organizationGovModel);
                yield put({ type: 'fetch', payload: params });
            }
        },
    },

    /**
     *  同步请求 *************************************************************************************
     *  */

    reducers: {
        list(state, action) {
          const rv = {
                ...state,
                data: action.payload.params.data,
                tree: utils.addToTree(action.payload.params.data),
                params: action.payload.params,
                ...action,
            };
            return rv;
        },
        listOrgLevel(state, action) {
            const rv = {
                ...state,
                orgLevel: action.payload.params.data,
            };
            console.log('listOrgLevel :>> ', rv);
            return rv;
        },
        listOrgCategory(state, action) {
            const rv = {
                ...state,
                orgCategory: action.payload.params.data,
                orgCategoryTree: utils.dataToTree(action.payload.params.data),
            };
            console.log('listOrgCategory :>> ', rv);
            return rv;
        },
        Subjection(state, action) {
            const rv = {
                ...state,
                Subjection: action.payload.params.data,
                SubjectionTree: utils.dataToTree(action.payload.params.data),
            };
            console.log('fetchSubjection :>> ', rv);
            return rv;
        },
        tenant(state, action) {
            const rv = {
                ...state,
                tenant: action.payload.params.data,
                // tree: utils.addToTree(action.payload.params.data),
                params: action.payload.params,
                ...action,
            };
            return rv;
        },
        province(state, action) {
            const rv = {
                ...state,
                bamData: action.payload.params.data,
                bamTree: utils.gxToTree(action.payload.params.data),
                params: action.payload.params,
            };
            return rv;
        },
        save(state, action) {
            const rv = {
                ...state,
                ...action,
            };
            return rv;
        },
        area(state, action) {
            const rv = {
                ...state,
                area: action.payload.params.data,
                areaTree: utils.dataToTree(action.payload.params.data),
            };
            return rv;
        }
    },
};

export default Model;
