export const state = () => ({

})

export const mutations = {

}

export const actions = {
    async addComment({ }, data) {
        try {
            await this.$axios.$post("/api/comment/add", {
                ...data
            });
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }

    }
}