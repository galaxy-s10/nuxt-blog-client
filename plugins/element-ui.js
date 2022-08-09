import {
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
  Loading,
  Switch,
  Dialog,
  Popover,
} from 'element-ui';
import Vue from 'vue';
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

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

Vue.use(Element);
Vue.use(Loading);

// Vue.use(Element, { locale })
