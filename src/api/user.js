import request from '@/utils/request';

export function getRoutesConfig() {
  // 可以处理成需要的数据
  return request.get('/routes').then(res => {
    return Object.keys(res.data);
  });
}
