export default {
  async getAllUsers(context, payload) {
    const res = await this.$axios.$get("/api/users");
    if (!res.error) {
      context.commit("handleUpdateUsers", res);
    }
  },

  async register(context, payload) {
    try {
      const res = await this.$axios.$post("/register", payload);

      if (res && !res.error) {
        this.commit("handleNotification", {
          type: "success",
          msg: res.mensagem,
        });
        return { success: true };
      }

      this.commit("handleNotification", {
        type: "warn",
        msg: res.mensagem,
      });
      return { success: false };
    } catch (error) {
      this.commit("handleNotification", {
        type: "warn",
        msg: error,
      });
      return { success: false };
    }
  },

  async login(context, payload) {
    if (!payload.username || !payload.password) {
      return null;
    }
    try {
      this.commit("handleLoading", true);
      const res = await this.$axios.$post("/login", payload);
      if (res?.error) {
        this.commit("handleNotification", {
          type: "warn",
          msg: res.mensagem,
        });
        return {
          success: false,
          data: null,
        };
      } else {
        this.commit("handleNotification", { type: "", msg: "" });
        context.commit("handleConnectedUser", res);

        return {
          data: res,
          success: true,
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
};
