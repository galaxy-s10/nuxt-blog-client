const actions = {
  // https://nuxtjs.org/docs/directory-structure/store/#the-nuxtserverinit-action
  nuxtServerInit({ commit, dispatch }) {
    try {
      console.log(`${new Date().toLocaleString()} --- nuxtServerInit完成`);
    } catch (error) {
      console.log(
        `${new Date().toLocaleString()} --- nuxtServerInit错误`,
        error
      );
    }
  },
};

export default {
  actions,
};
