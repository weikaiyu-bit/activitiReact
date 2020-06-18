import { getRoute } from '../services/route';

const Model = {
  namespace: 'routeModel',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getRoute, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
  },
  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload,
      };
      return rv;
    },
  },
};

export default Model;
