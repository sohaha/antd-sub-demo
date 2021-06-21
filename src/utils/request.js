import axios from 'axios';
import { isSingle } from '@/lib/subApp/singleBootstrap';

// 跨域代理前缀
const API_PROXY_PREFIX = '/api';
export const BASE_URL =
  process.env.NODE_ENV === 'production' || isSingle()
    ? process.env.VUE_APP_API_BASE_URL
    : API_PROXY_PREFIX;

// token 请求头
const xsrfHeaderName = 'Authorization';

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = xsrfHeaderName;
axios.defaults.xsrfCookieName = xsrfHeaderName;

const requests = {
  get(url, params, config) {
    return axios.get(url, { params, ...config });
  },
  post(url, params, config) {
    return axios.post(url, { params, ...config });
  },
  put(url, params, config) {
    return axios.put(url, { params, ...config });
  },
  delete(url, params, config) {
    return axios.delete(url, { params, ...config });
  },
};

export default requests;

/**
 * axios请求
 * @param url 请求地址
 * @param method
 * @param params
 * @param config
 */
export function request(url, { method, params, config }) {
  if (!requests[method]) {
    return axios.get(url, { params, ...config });
  }
  return requests[method](url, { params, ...config });
}

/**
 * 设置认证信息
 * @param auth {Object}
 */
export function setAuthorization(token) {
  localStorage.setItem(xsrfHeaderName, token);
}

/**
 * 获取认证信息
 */
export function getAuthorization() {
  return localStorage.getItem(xsrfHeaderName) || '';
}

/**
 * 移出认证信息
 */
export function removeAuthorization() {
  localStorage.removeItem(xsrfHeaderName);
}

/**
 * 检查认证信息
 * @returns {boolean}
 */
export function checkAuthorization() {
  return !!localStorage.getItem(xsrfHeaderName);
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
export function loadInterceptors(options) {
  const { request, response } = {
    request: [reqCommon], // 请求拦截
    response: [resp401, resp403], // 响应拦截
  };

  // 加载请求拦截器
  request.forEach(item => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config;
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error);
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    );
  });
  // 加载响应拦截器
  response.forEach(item => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response;
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error);
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    );
  });
}

// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   */
  onFulfilled(response, options) {
    const { message } = options;
    if (response.code === 401) {
      message.error('无此权限');
    }
    return response;
  },
  /**
   * 响应出错时执行
   */
  onRejected(error, options) {
    const { message } = options;
    const { response } = error;
    if (response.status === 401) {
      message.error('无此权限');
    }
    return Promise.reject(error);
  },
};

const resp403 = {
  onFulfilled(response, options) {
    const { message } = options;
    if (response.code === 403) {
      message.error('请求被拒绝');
    }
    return response;
  },
  onRejected(error, options) {
    const { message } = options;
    const { response } = error;
    if (response.status === 403) {
      message.error('请求被拒绝');
    }
    return Promise.reject(error);
  },
};

const reqCommon = {
  /**
   * 发送请求之前做些什么
   */
  onFulfilled(config, options) {
    const { store } = options;
    // message.warning('提示信息');
    config.headers.common['Authorization'] = store.state?.global?.token;
    return config;
  },
  /**
   * 请求出错时做点什么
   */
  onRejected(error, options) {
    const { message } = options;
    message.error(error.message);
    return Promise.reject(error);
  },
};
