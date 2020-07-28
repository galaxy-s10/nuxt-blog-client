const actions = {
    async nuxtServerInit({ dispatch }) {
        await dispatch("article/articlehotlist", {
            ordername: "click",
            orderby: "desc",
            nowpage: 1
        });
        await dispatch("article/articletypelist");
        await dispatch("tag/getTagList");
    },
};

export default {
    actions
}