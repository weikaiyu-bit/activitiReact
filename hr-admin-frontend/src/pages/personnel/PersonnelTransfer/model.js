import {
    list,
    add,
    update,
    remove,
    listOrgOrg,
    listOrg,
    findPositionLevel,
    findEducational,
    findAnnualAppraisalNarrative,
    findRewardsPunishments,
    findFamilyRelations,
    addRecords
} from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
    namespace: 'personnelTransferModal',
    state: {
        data: [],
        total: 0,
    },


    /** 异步请求 ************************************************************************************* */

    effects: {
        * fetch({ payload, callback }, { call, put }) {
            const response = yield call(list, payload);
            if (callback) callback(response)
            yield put({
                type: 'list',
                payload: {
                    params: payload,
                    ...response,
                },
            });
        },
        * add({ payload, callback }, { call, put, select }) {
            const response = yield call(add, payload);
            if (callback) callback(response);
            if (response.code === 0) {
                const { params } = yield select(state => state.personnelTransferModal);
                yield put({ type: 'fetch', payload: params });
            }
        },
        * update({ payload, callback }, { call, put, select }) {
            const response = yield call(update, payload);
            if (callback) callback(response);
            if (response.code === 0) {
                const { params } = yield select(state => state.personnelTransferModal);
                yield put({ type: 'fetch', payload: params });
            }
        },
        * remove({ payload, callback }, { call, put, select }) {
            const response = yield call(remove, payload);
            if (callback) callback(response);
            if (response.code === 0) {
                const { params } = yield select(state => state.personnelTransferModal);
                yield put({ type: 'fetch', payload: params });
            }
        },
        * fetchOrgOrg({ payload }, { call, put }) {
            const response = yield call(listOrgOrg, payload);
            yield put({
                type: 'listOrgOrg',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * fetchOrg({ payload }, { call, put }) {
            const response = yield call(listOrg, payload);
            yield put({
                type: 'orgOrg',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * fetchPositionLevel({ payload }, { call, put }) {
            const response = yield call(findPositionLevel, payload);
            yield put({
                type: 'PositionLevel',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * fetchEducational({ payload }, { call, put }) {
            const response = yield call(findEducational, payload);
            yield put({
                type: 'Educational',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * fetchAnnualAppraisalNarrative({ payload }, { call, put }) {
            const response = yield call(findAnnualAppraisalNarrative, payload);
            yield put({
                type: 'AnnualAppraisalNarrative',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * fetchRewardsPunishments({ payload }, { call, put }) {
            const response = yield call(findRewardsPunishments, payload);
            yield put({
                type: 'RewardsPunishments',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * fetchFamilyRelations({ payload }, { call, put }) {
            const response = yield call(findFamilyRelations, payload);
            yield put({
                type: 'FamilyRelations',
                payload: {
                    params: payload, // 把查询参数存起来，用于自动刷新列表
                    ...response, // 把查询结果存储起来
                },
            });
        },
        * addRecord({ payload, callback }, { call, put, select }) {
            const response = yield call(addRecords, payload);
            if (callback) callback(response);
            // if (response.code === 0) {
            //     const { params } = yield select(state => state.personnelTransferModal);
            //     // yield put({ type: 'saverecord', payload: params });
            // }
        },
    },

    /** 同步请求 ************************************************************************************* */

    reducers: {
        list(state, action) {
            const rv = {
                ...state,
                data: action.payload.data,
                total: action.payload.total,
                limit: action.payload.limit,
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
        // listOrgOrg(state, action) {
        //   // 合并state
        //   const rv = {
        //     ...state,
        //     orgData: action.payload.data,
        //     tree: utils.listToTree(action.payload.data),
        //     functionsTotal: action.payload.total,
        //     functionsLimit: action.payload.number,
        //     functionsParams: action.payload.params,
        //   };
        //   console.log('rv******tree', rv);
        //   return rv;
        // },
        orgOrg(state, action) {
            // 合并state
            const rv = {
                ...state,
                orgData: action.payload.data,
                tree: utils.listToTree(action.payload.data),
                functionsTotal: action.payload.total,
                functionsLimit: action.payload.number,
                functionsParams: action.payload.params,
            };
            return rv;
        },
        PositionLevel(state, action) {
            const rv = {
                ...state,
                positionLevelData: action.payload.data,
            };
            return rv;
        },
        Educational(state, action) {
            const rv = {
                ...state,
                educationalData: action.payload.data,
            };
            return rv;
        },
        AnnualAppraisalNarrative(state, action) {
            const rv = {
                ...state,
                annualAppraisalNarrativeData: action.payload.data,
            };
            return rv;
        },
        RewardsPunishments(state, action) {
            const rv = {
                ...state,
                rewardsPunishmentsData: action.payload.data,
            };
            return rv;
        },
        FamilyRelations(state, action) {
            const rv = {
                ...state,
                familyRelationsData: action.payload.data,
            };
            return rv;
        },
    },
};


export default Model;