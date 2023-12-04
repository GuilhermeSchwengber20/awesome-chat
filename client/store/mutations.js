export default {
    handleLoading(state, status) {
        state.loading = status;
    },

    handleNotification(state, payload) {
        state.Notification = {
            type: payload.type,
            msg: payload.msg
        }
    },
}