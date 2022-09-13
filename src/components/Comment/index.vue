<template>
  <div class="comment-wrap">
    <div class="title">
      <div>
        <span>Comments | {{ total || 0 }} 条留言</span>
        <i class="el-icon-refresh" @click="refresh()"></i>
      </div>
      <LoginCpt />
    </div>
    <SortTabCpt :sort="sort" @sortChange="sortChange"></SortTabCpt>
    <div v-if="list.length > 0">
      <div v-loading="listLoading">
        <ItemCpt
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          @handleModal="handleModal"
          @handleStar="handleStar"
          @closeModal="closeModal"
          @showReply="showReply"
          @deleteReply="deleteReply"
        ></ItemCpt>
        <div v-if="hasMore" class="load-more" @click="handleParentPage">
          加载更多留言
          <i class="el-icon-arrow-down"></i>
        </div>
        <div v-else class="load-more">已加载所有留言~</div>
      </div>
    </div>
    <div v-else class="no-comment">目前还没有人留言~</div>

    <ModalCpt
      v-if="currentComment"
      :title="currentComment.children_comment_total + '条回复'"
      top="20%"
      class="comment-modal-wrap"
      @closeModal="closeModal"
    >
      <template #content>
        <div class="parent">
          <ItemCpt
            :item="currentComment"
            @handleStar="handleStar"
            @showReply="showReply"
            @deleteReply="deleteReply"
          ></ItemCpt>
        </div>

        <div v-loading="childListLoading" class="child-list-wrap">
          <SortTabCpt
            :sort="modalSort"
            @sortChange="changeModalSort"
          ></SortTabCpt>
          <div v-if="childList" ref="childListRef" class="child-list">
            <ItemCpt
              v-for="(item, index) in childList"
              :key="index"
              :item="item"
              @handleModal="handleModal"
              @handleStar="handleStar"
              @closeModal="closeModal"
              @showReply="showReply"
              @deleteReply="deleteReply"
            ></ItemCpt>
            <div ref="childListHasMoreRef" class="has-more-observer"></div>
            <el-divider v-if="!childListHasMore">没有更多内容了</el-divider>
          </div>
        </div>
      </template>
    </ModalCpt>

    <component
      :is="currentComponent"
      :username="
        currentReplyComment ? currentReplyComment.from_user.username : ''
      "
      @closeReply="closeReply"
      @reply="handleReply"
    ></component>
  </div>
</template>

<script>
import LoginCpt from 'components/Login/index.vue';
import ModalCpt from 'components/Modal/index.vue';
import ReplyCpt from 'components/Reply/index.vue';
import { MessageBox } from 'element-ui';

import ItemCpt from './components/Item/index.vue';
import SortTabCpt from './components/SortTab/index.vue';

import { deepCloneByJson } from '@/utils/index';
export default {
  components: {
    LoginCpt,
    ReplyCpt,
    SortTabCpt,
    ItemCpt,
    ModalCpt,
  },
  props: {
    sort: {
      type: String,
      require: true,
      default: 'date',
    },
    list: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
    nowPage: {
      type: Number,
      require: true,
      default: 0,
    },
    pageSize: {
      type: Number,
      require: true,
      default: 0,
    },
    childrenPageSize: {
      type: Number,
      require: true,
      default: 0,
    },
    hasMore: {
      type: Boolean,
      require: true,
    },
    total: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  data() {
    return {
      currentComponent: null,
      currentReplyComment: null,
      listLoading: false,
      modalSort: 'date',
      currentComment: null,
      childListParams: {
        article_id: null,
        nowPage: null,
        pageSize: null,
        orderBy: null,
        orderName: null,
        parent_comment_id: null,
      },
      childList: null,
      childListLoading: false,
      childListHasMore: false,
      childListIsBottom: false, // 是否触底
    };
  },
  computed: {},
  watch: {
    childListIsBottom(newVal, oldVal) {
      if (this.childListLoading) return;
      if (newVal && this.childListHasMore) {
        this.childListParams.nowPage += 1;
        this.ajaxChildComment(this.childListParams);
      }
    },
  },
  mounted() {},
  methods: {
    async refresh() {
      if (this.currentComment !== null) {
        this.childListParams.nowPage = 1;
        await this.ajaxChildComment(this.childListParams);
      }
      this.$emit('refresh');
    },
    closeModal() {
      this.currentComment = null;
    },
    async ajaxChildComment(params) {
      try {
        this.childListLoading = true;
        const { data } = await this.$myaxios.get(`/comment/child_comment`, {
          params,
        });
        if (params.nowPage === 1) {
          this.childList = data.rows;
        } else {
          this.childList = [...this.childList, ...data.rows];
        }
        this.childListHasMore = data.hasMore;
        this.childListLoading = false;
      } catch (error) {
        console.log(error);
        this.childListLoading = false;
      }
    },
    // 触底事件
    touchBottom() {
      this.$nextTick(() => {
        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((item) => {
              if (!item.isIntersecting) {
                this.childListIsBottom = false;
              } else {
                this.childListIsBottom = true;
              }
            });
          },
          { root: this.$refs.childListRef }
        );
        intersectionObserver.observe(this.$refs.childListHasMoreRef);
      });
    },
    // 弹窗回复数据
    async handleModal(v) {
      const item = deepCloneByJson(v);
      delete item.children_comment;
      this.currentComment = item;
      const params = {
        article_id: item.article_id,
        nowPage: this.nowPage,
        pageSize: this.pageSize,
        orderBy: 'desc',
        orderName: this.sort === 'date' ? 'created_at' : 'star_total',
        parent_comment_id: item.id,
      };
      this.childListParams = params;
      await this.ajaxChildComment(params);
      this.touchBottom();
    },
    // 修改了弹窗的tab
    async changeModalSort(val) {
      const wrap = this.$refs.childListRef;
      wrap.scrollTo({ top: 0 });
      this.modalSort = val;
      const params = {
        article_id: this.currentComment.article_id,
        nowPage: this.nowPage,
        pageSize: this.pageSize,
        orderBy: 'desc',
        orderName: val === 'date' ? 'created_at' : 'star_total',
        parent_comment_id: this.currentComment.id,
      };
      this.childListParams = params;
      await this.ajaxChildComment(params);
      this.touchBottom();
    },
    sortChange(val) {
      this.$emit('sortChange', val);
    },
    async ajaxCreateStar(item) {
      try {
        await this.$myaxios.post(`/star/create`, {
          article_id: item.article_id,
          comment_id: item.id,
          to_user_id: item.from_user_id,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async ajaxDeleteStar(item) {
      try {
        await this.$myaxios.delete(`/star/delete/${item.is_star_id}`, {});
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 点赞
     */
    async handleStar(item) {
      const type = item.is_star === false;
      if (!this.$store.state.user.userInfo) {
        this.$newmessage('暂未登录，请登录！', 'warning');
        return;
      }
      if (type) {
        await this.ajaxCreateStar(item);
        this.$newmessage('点赞ok~', 'success');
      } else if (type === false) {
        await this.ajaxDeleteStar(item);
        this.$newmessage('取消点赞ok~', 'success');
      }
      this.refresh();
    },
    // handleChildrenPage(v) {
    //   v.nowPage = v.nowPage ? v.nowPage + 1 : 1
    //   this.$emit('handleChildrenPage', {
    //     article_id: v.article_id,
    //     parent_comment_id: v.id,
    //     childrenPageSize: this.childrenPageSize,
    //   })
    // },
    handleParentPage() {
      this.$emit('handleParentPage', {
        nowPage: this.nowPage,
        pageSize: this.pageSize,
        orderName: this.sort === 'date' ? 'created_at' : 'star_total',
        orderBy: 'desc',
      });
    },
    // 显示回复框
    showReply(item) {
      this.currentReplyComment = item;
      this.currentComponent = 'ReplyCpt';
    },
    // 删除回复
    deleteReply(item) {
      const msg =
        item.children_comment_total === 0
          ? '确定删除评论吗?'
          : `你的评论有${item.children_comment_total}条回复，确定删除评论吗？`;
      MessageBox.confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            const res = await this.$myaxios.delete(
              `/comment/delete/${item.id}`
            );
            this.$newmessage(res.message, 'success');
            this.refresh();
          } catch (error) {
            this.$newmessage(error, 'error');
          }
        })
        .catch(() => {
          this.$newmessage('已取消删除', 'info');
        });
    },
    // 关闭回复框
    closeReply() {
      this.currentReplyComment = null;
      this.currentComponent = null;
    },
    // 新增回复
    async handleReply(content) {
      try {
        await this.$myaxios.post('/comment/create', {
          article_id: this.currentReplyComment.article_id,
          content,
          parent_comment_id:
            this.currentReplyComment.parent_comment_id === -1
              ? this.currentReplyComment.id
              : this.currentReplyComment.parent_comment_id,
          reply_comment_id: this.currentReplyComment.id,
          to_user_id: this.currentReplyComment.from_user_id,
        });
        this.$newmessage('回复成功~', 'success');
        this.refresh();
        this.closeReply();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';

.comment-wrap {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    .el-icon-refresh {
      color: $theme-color1;
      cursor: pointer;
    }
  }

  .load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 4px;
    background-color: $theme-color4;
    cursor: pointer;
  }

  .no-comment {
    padding: 40px 0;
    text-align: center;
  }
  .comment-modal-wrap {
    .parent {
      overflow: hidden;
      margin-top: 10px;
    }
    .child-list-wrap {
      margin-left: 30px;
      .child-list {
        overflow-y: scroll;
        min-height: 200px;
        max-height: 300px;
        @extend .hideScrollbar;

        .has-more-observer {
          width: 1px;
          height: 1px;
        }
      }
    }
  }
}
</style>
