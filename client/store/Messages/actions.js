export default {
    async getByUser(context, payload) {
        const { recipientUserId, userId } = payload;
        const res = await this.$axios.$get(`/api/messages/${userId}/${recipientUserId}`);
        if(!res.error && res.length > 0) {
            context.commit("setCurrentMessages", res);
            context.commit("setOwnerMessages", res);
        }
    }
}