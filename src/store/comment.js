export const state = () => ({
  childrenPageSize: 2,
});

export const mutations = {};

export const actions = {
  // eslint-disable-next-line no-shadow
  async reply({ commit, state }, payload) {
    try {
      const { data } = await this.$myaxios.post('/comment/create', {
        article_id: payload.article_id,
        content: payload.content,
        parent_comment_id: payload.parent_comment_id,
        to_user_id: payload.to_user_id,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
