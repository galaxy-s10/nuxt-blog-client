const actions = {
    async nuxtServerInit({ dispatch }) {
        await dispatch("article/getArticleHotList", {
            ordername: "click",
            orderby: "desc",
            nowpage: 1
        });
        await dispatch("article/getArticleTypeList");
        await dispatch("tag/getTagList");
        // await dispatch("user/getUserInfo");
    },
};

export default {
    actions
}