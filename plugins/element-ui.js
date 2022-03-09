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

// Vue.use(Button)
// Vue.use(Tooltip)
// Vue.use(Dropdown)
// Vue.use(DropdownItem)
// Vue.use(DropdownMenu)
// Vue.use(Input)
// Vue.use(Tag)
// Vue.use(Divider)
// Vue.use(Timeline)
// Vue.use(TimelineItem)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Autocomplete)
// Vue.use(Pagination)

// Vue.use(Element, { locale })
