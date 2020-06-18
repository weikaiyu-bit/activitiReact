import { list, add, update, remove, listFunctions, listRsRoleFunc, saveRoleFunc } from './service';
import utils from '../../../dtsea/common/utils';
import ErrorCode from '../../../dtsea/common/ErrorCode';

const Model = {
  namespace: 'sysRolesModel',
  state: {
    data: [],
    total: 0,
    selectedRoleFuncs: [],
  },

  /** 异步请求
   *  *************************************************************************************
   *  */

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'list',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *fetchFunctions({ payload }, { call, put }) {
      const response = yield call(listFunctions, payload);
      yield put({
        type: 'listFunctions',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },

    *fetchRsRoleFunc({ payload, callback }, { call, put }) {
      const response = yield call(listRsRoleFunc, payload);
      if (response.code === ErrorCode.SUCCESS) {
        yield put({
          type: 'save',
          payload: {
            selectedRoleFuncs: response.data, // 把查询结果存储起来
          },
        });
        if (callback) callback(response);
      }
    },
    *saveRoleFunc({ payload, callback }, { call, put }) {
      const response = yield call(saveRoleFunc, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        ...action.payload,
      };
      return rv;
    },
    listFunctions(state, action) {
      // 合并state
      const rv = {
        ...state,
        tree: utils.listToTree(action.payload.data),
        functionsTotal: action.payload.total,
        functionsLimit: action.payload.number,
        functionsParams: action.payload.params,
      };
      return rv;
    },
    // listRsRoleFunc(state, action) {
    //   // 合并state
    //   const rv = {
    //     ...state,
    //     selectedRoleFuncs: action.payload.data,
    //   };
    //   return rv;
    // },
    save(state, action) {
      const rv = {
        ...state,
        ...action.payload,
      };
      return rv;
    },
  },
};

export default Model;
