import {
  list,
  add,
  update,
  remove,
  resetPwd,
  listRoles,
  findRsUserRole,
  listfindFunc,
  saveUserRole,
} from './service';
import ErrorCode from '../../../dtsea/common/ErrorCode';

const Model = {
  namespace: 'sysUsersModel',
  state: {
    data: [],
    total: 0,
    selectedUserRoles: [],
  },

  /**
   *  异步请求 *************************************************************************************
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
    *resetPwd({ payload, callback }, { call, put, select }) {
      const response = yield call(resetPwd, payload);
      if (callback) callback(response);
    },
    *fetchRoles(_, { call, put }) {
      const response = yield call(listRoles);
      yield put({
        type: 'listRoles',
        payload: {
          ...response, // 把查询结果存储起来
        },
      });
    },

    *fetchRsUserRole({ payload, callback }, { call, put }) {
      const response = yield call(findRsUserRole, payload);

      console.log('fetchRsUserRole', response);
      if (response.code === ErrorCode.SUCCESS) {
        yield put({
          type: 'save',
          payload: {
            selectedUserRoles: response.data, // 把查询结果存储起来
          },
        });

        if (callback) callback(response);
      }
    },

    // 保存用户角色
    *saveUserRole({ payload, callback }, { call, put }) {
      const response = yield call(saveUserRole, payload);
      if (callback) callback(response);
    },

    // *listfindFunc(p, { call, put }) {
    //   const response = yield call(listfindFunc);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       ...response, // 把查询结果存储起来
    //     },
    //   });
    // },
  },

  /**
   * *同步请求 **************************************************************************************
   * */

  reducers: {
    list(state, action) {
      // 合并state
      const rv = {
        ...state,
        ...action.payload,
      };
      return rv;
    },
    listRoles(state, action) {
      // 合并state
      const rv = {
        ...state,
        roles: action.payload.data,
        rolesTotal: action.payload.total,
        rolesLimit: action.payload.number,
        rolesParams: action.payload.params,
      };
      return rv;
    },
    listRsUserRole(state, action) {
      // 合并state
      const rv = {
        ...state,
        selectedRoles: action.payload.data,
        rsUserRolesTotal: action.payload.total,
        rsUserRolesLimit: action.payload.number,
        rsUserRolesParams: action.payload.params,
      };
      return rv;
    },
    save(state, action) {
      // 合并state
      const rv = {
        ...state,
        ...action.payload,
      };
      return rv;
    },
  },
};
export default Model;
