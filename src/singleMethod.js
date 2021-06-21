import singleMethod from '@/lib/subApp/singleMethod';
import { log } from './lib/debug';

const setHtmlTitle = ({ data: title }) => {
  document.title = title;
  log('修改页面标题:', title);
};

// 可以在这里覆盖掉通用的方法
export default {
  ...singleMethod,
  setHtmlTitle,
};
