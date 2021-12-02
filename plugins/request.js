import axios from 'axios';
import https from 'https';

export const request = axios.create({
  // baseURL:'https://api.realworld.io',
  // baseURL:'https://conduit.productionready.io',
  baseURL: 'http://realworld.api.fed.lagounews.com',
});

const agent = new https.Agent({
  rejectUnauthorized: false
});

export default ({ store, app }) => {
  //请求拦截器
  request.interceptors.request.use(function (config) {
    // Do something before request is sent
    const { user } = store.state;
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    if (process.env.NODE_ENV === 'development') {
      config.httpsAgent = agent;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  //响应拦截器
  request.interceptors.response.use(
    response => {
      //拦截响应，做统一处理
      return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
      if (error.response.status == '401') {
        app.router.replace('/login');
        return;
      }
      return Promise.reject(error.response.status) // 返回接口返回的错误信息
    })
}