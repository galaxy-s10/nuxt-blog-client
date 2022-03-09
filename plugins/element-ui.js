import Vue from 'vue'
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'
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
} from 'element-ui'

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
]

const Element = {
  install(Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  },
}

Vue.use(Element)
Vue.use(Loading)

// Vue.use(Element, { locale })
