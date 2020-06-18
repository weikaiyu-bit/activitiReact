import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeAccountLogin, getFakeCaptcha, login } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import ErrorCode from '../../../dtsea/common/ErrorCode';

const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
  },
  effects: {
    * login ({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(login, payload);
      console.log('login', response);
      if (response.code === ErrorCode.SUCCESS) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        }); // Login successfully

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        window.location.href = redirect || '/';
        // yield put(routerRedux.replace(redirect || '/'));
      } else if (response.msg) {
        message.error(response.msg);
      }
    },

    * getCaptcha ({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus (state, { payload }) {
      // setAuthority(payload.currentAuthority);
      // 将accessToken存储起来
      localStorage.setItem('accessToken', payload.data);
      // 写cookies
      const now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      const expires = now.getTime();
      document.cookie = `access_token=${encodeURIComponent(payload.data)};path=/;expires=${expires}`;
      console.log('document.cookie', document.cookie);
      return {
        ...state,
        accessToken: payload.data,
      };
    },
  },
};
export default Model;
