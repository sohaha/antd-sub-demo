import Vue from 'vue';

import {
  Layout,
  Input,
  Button,
  Modal,
  Space,
  message,
  Alert,
  notification
} from 'ant-design-vue';

Vue.use(Layout);
Vue.use(Input);
Vue.use(Button);
Vue.use(Space);
Vue.use(Alert);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
