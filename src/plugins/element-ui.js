import {
  Loading,
  Button,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Input,
  Tag,
  Divider,
  Timeline,
  TimelineItem,
  Form,
  FormItem,
  Autocomplete,
  Pagination,
  Switch,
  Dialog,
  Popover,
} from 'element-ui';
import Vue from 'vue';

// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// 别把Loading放里面！
const components = [
  Button,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Input,
  Tag,
  Divider,
  Timeline,
  TimelineItem,
  Form,
  FormItem,
  Autocomplete,
  Pagination,
  Switch,
  Dialog,
  Popover,
];

const Element = {
  install(vue) {
    components.forEach((component) => {
      vue.component(component.name, component);
    });
  },
};

export default () => {
  if (Vue._is_use_elementui) {
    return;
  }

  Vue.use(Element);
  Vue.use(Loading.directive);

  Vue._is_use_elementui = true;
};
// Vue.use(Element, { locale })
