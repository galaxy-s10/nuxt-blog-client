<template>
  <div class="link-wrap">
    <h1 class="title">友链</h1>
    <hr class="hr-class" />
    <ul class="link-list-wrap">
      <template v-if="linkList.length">
        <li v-for="(item, index) in linkList" :key="index" class="li-item-wrap">
          <a :href="item.url" class="li-item-link" target="_blank">
            <img v-lazy="item.avatar" class="user-avatar" />
            <div class="desc">
              <span>{{ item.name }}</span>
              <span class="txt" :title="item.desc">
                {{ item.desc }}
              </span>
            </div>
          </a>
        </li>
      </template>
      <span v-else>暂无友链~</span>
    </ul>

    <h2 class="title-desc">欢迎大家交换友链~</h2>

    <div>
      <el-form
        ref="linkForm"
        :model="linkForm"
        :rules="linkRules"
        label-width="100px"
      >
        <el-form-item label="网站名称" prop="name">
          <el-input
            v-model="linkForm.name"
            placeholder="输入您网站的名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input
            v-model="linkForm.url"
            placeholder="输入您网站的链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站介绍" prop="desc">
          <el-input
            v-model="linkForm.desc"
            placeholder="简单介绍一下您的网站"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站logo" prop="avatar">
          <el-input
            v-model="linkForm.avatar"
            placeholder="输入您网站显示的logo"
          ></el-input>
        </el-form-item>
        <el-form-item label="您的邮箱" prop="email">
          <el-input
            v-model="linkForm.email"
            placeholder="审核结果会通过邮件通知您"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="frontendData">
          <el-button
            type="primary"
            :disabled="frontendData.frontend_link === -1"
            @click="addLink()"
          >
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { init } from '@/mixin/init';

const validateEmail = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9\u4E00-\u9FA5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱!'));
    }
    return callback();
  } else {
    callback();
  }
};

export default {
  components: {},
  mixins: [init],
  layout: 'blog',
  async asyncData({ $myaxios, params, store }) {
    // 获取友链数据
    const { data: linkData } = await $myaxios.get('/link/list', {
      // params: { nowPage: 1, pageSize: 100 },
    });
    return { linkList: linkData.rows };
  },
  data() {
    return {
      linkForm: {
        name: '',
        url: '',
        desc: '',
        avatar: '',
        email: '',
      },
      linkRules: {
        name: [
          { required: true, message: '网站名称不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '网站名称要求3-50个字符',
            trigger: 'blur',
          },
        ],
        url: [
          { required: true, message: '网站地址不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 80,
            message: '网站地址要求5-80个字符',
            trigger: 'blur',
          },
        ],
        desc: [
          { required: true, message: '网站介绍不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '网站介绍要求3-50个字符',
            trigger: 'blur',
          },
        ],
        avatar: [
          { required: true, message: '网站logo不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 80,
            message: '网站logo要求5-80个字符',
            trigger: 'blur',
          },
        ],
        email: [
          {
            validator: validateEmail,
            trigger: 'change',
          },
        ],
      },
    };
  },
  head() {
    return {
      title: '友链 - 自然博客',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Natural Blog - Link',
        },
      ],
    };
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    // 申请友链
    addLink() {
      this.$refs.linkForm.validate(async (valid) => {
        if (valid) {
          try {
            await this.$myaxios.post('/link/create', {
              ...this.linkForm,
              email:
                this.linkForm.email === '' ? undefined : this.linkForm.email,
            });
            this.$newmessage('已提交友链申请~', 'success');
            Object.keys(this.linkForm).forEach((i) => {
              this.linkForm[i] = '';
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          this.$newmessage('请按要求输入正确!', 'error');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';

@media screen and (max-width: 720px) {
  .li-item-wrap {
    flex-basis: 50% !important;
  }
}
@media screen and (max-width: 540px) {
  .li-item-wrap {
    flex-basis: 100% !important;
  }
}
.link-wrap {
  .title {
    display: block;
    text-align: center;
  }
  .link-list-wrap {
    display: flex;
    overflow-y: scroll;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 40px 0;
    padding: 0;
    max-height: 400px;

    @extend .hideScrollbar;
    &::after {
      content: '';
      width: 30%;
      margin: 0 1%;
    }
    .li-item-wrap {
      position: relative;
      overflow: hidden;
      width: 30%;
      margin: 0 1%;
      margin-bottom: 10px;
      border-radius: 4px;
      list-style: none;
      .li-item-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border: 1px solid $theme-color4;
        color: $theme-color5;
        text-decoration: none;

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          transition: all 0.5s;
        }
        .desc {
          flex: 1;
          margin-left: 8px;
          font-size: 14px;
          .txt {
            @include multiEllipsis(2);
          }
        }
      }
      &::before {
        position: absolute;
        left: -60px;
        z-index: -1;
        width: 0;
        height: 100%;
        background-color: rgba(255, 174, 173, 0.5);
        content: '';
        transition: all 0.5s;
        transform: skewX(45deg);
      }
      &:hover {
        z-index: 2;
        .li-item-link {
          border-color: rgba(255, 174, 173, 1);
        }
        .user-avatar {
          transition: all 0.5s;
          transform: rotate(360deg);
        }
        &:before {
          width: 160%;
        }
      }
    }
  }
  .title-desc {
    display: block;
    text-align: center;
  }
}
</style>
