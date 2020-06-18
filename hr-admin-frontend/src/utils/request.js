/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';
import ErrorCode from '../dtsea/common/ErrorCode';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// 请求或响应被 then 或 catch 处理前拦截
// 参考 https://github.com/umijs/umi-request/blob/HEAD/README_zh-CN.md
// request拦截器, 附加access_token
request.interceptors.request.use((url, options) => {
  if (url.indexOf('?') === -1) {
    url += '?';
  } else {
    url += '&';
  }

  let accessToken = localStorage.getItem('accessToken');
  accessToken = accessToken ? encodeURIComponent(accessToken) : '';

  url += `access_token=${accessToken}&t=${new Date().getTime()}`;

  return {
    url,
    options,
  };
});

// response拦截器, 处理response
request.interceptors.response.use(async response => {
  const res = await response.clone().json();

  if (res && res.code === ErrorCode.NOT_LOGIN) {
    if (res.data) {
      notification.error({
        message: '账号已在别处登录',
        description: res.data,
      });
    }
    console.log(res)
    localStorage.removeItem('accessToken');
    // window.location.href = '#/user/login';
    router.replace('/user/login');
  }
  return response;
});

export default request;
