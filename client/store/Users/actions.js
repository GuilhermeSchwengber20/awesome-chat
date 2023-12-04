export default {
    async getAllUsers(context, payload) {
        const res = await this.$axios.$get("/api/users");
        console.log(res);
        if(!res.error) {
            context.commit("handleUpdateUsers", res)
        }
    },
    async login(context, payload) {
        if(!payload.username || !payload.password) {
            return null
        }
        this.commit("handleLoading", true);
        const res = await this.$axios.$post("/login", payload);
        try {
            if(res.error === "Nenhum usuário encontrado") {
                this.commit("handleNotification", {
                    type: "warn",
                    msg: res.error
                })
            } else {
                this.commit("handleNotification", {type: "", msg: ""})

                context.commit("handleConnectedUser", res);
                
                return {
                    data: res,
                    success: true
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
}