<template>
  <div class="container-section">
    <div class="content-page">
      <div class="content-menu" ref="contentMenu">
        <div class="content-options">
          <span>
            {{ `${User.username || ""}`.toUpperCase() }}
          </span>
          <span @click="logOutUser">
            <i class="fas fa-sign-out-alt fa-1x"></i>
          </span>
        </div>
        <div class="active-messages">
          <div
            class="user-card capitalize"
            v-for="(user, index) in Users"
            :key="index"
            @click="setReciverMessage(user)"
          >
            <span class="info-user">
              <span
                :class="`status ${user.isConnected ? 'connected' : ''}`"
              ></span>
              <span class="username">{{ user.username }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="content-chat" v-if="UserReceiver.id">
        <div class="container-user-selected">
          <i
            class="fas fa-ellipsis-v fa-2x"
            id="button-menu"
            @click="handleMenuUsers"
          ></i>
          <div class="img_test"></div>
          <span class="capitalize">{{ UserReceiver.username }}</span>
        </div>
        <div class="inner-scroll" ref="chatContainer">
          <div class="container-messages">
            <Message
              v-for="(message, index) in currentMessages"
              :key="`message-${index}`"
              :message="message"
            />
          </div>
        </div>
        <div class="container-type-message">
          <input
            type="text"
            v-model="message"
            @keydown.enter="sendPrivateMessage"
          />
          <button @click="sendPrivateMessage">Send</button>
        </div>
      </div>
      <div class="content-boas-vindas" v-else>
        <h3>
          Seja bem-vindo(a) Ao <span class="app-name">AWESOME CHAT</span>, Fique
          a vontade para escolher um usuário e interagir com ele! por favor não
          se esqueça que ainda estamos em DESENVOLVIMENTO
        </h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Chat-app",

  data() {
    return {
      message: "",
      shouldScrollToBottom: true,
    };
  },
  watch: {
    shouldScrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatContainer) {
          this.$refs.chatContainer.scrollTop =
            this.$refs?.chatContainer?.scrollHeight;
        }
      });
    },
  },
  beforeMount() {
    this.getAllUsers();
  },

  mounted() {
    this.updateUserSuccessful();
    this.registerMessageEvent();
  },

  computed: {
    currentMessages() {
      return this.$store.state.Messages.currentMessages;
    },
    User() {
      return this.$store.state.Users.connected;
    },

    UserReceiver() {
      return this.$store.state.Users.Receiver;
    },

    Users() {
      return this.$store.state.Users.content.filter(
        (user) => user.id !== this.User.id,
      );
    },
  },

  methods: {
    handleMenuUsers() {
      this.$refs.contentMenu.classList.toggle("active-menu");
    },

    updateUserSuccessful() {
      const socket = this.$socket;

      socket.on("updateSuccessful", () => {
        this.getAllUsers();
      });
    },
    async getAllUsers() {
      await this.$store.dispatch("Users/getAllUsers");
    },

    updateUserConnected(userId, isConnected) {
      const socket = this.$socket;
      socket.emit("userLoged", {
        userId,
        isConnected,
      });
    },

    logOutUser() {
      this.updateUserConnected(this.User.id, false);
      this.updateUserSuccessful();
      this.$store.commit("Users/userLogout");
      this.$router.push("/");
    },

    registerMessageEvent() {
      const socket = this.$socket;
      socket.on("private message", (data) => {
        this.$store.commit("Messages/addCurrentMessage", {
          content: data.message,
          recipient_user_id: data.recipientUserId,
          username: this.User.username,
          user_id: this.User.id,
        });
      });
      this.scrollToBottom();
    },

    setReciverMessage(user) {
      this.$store.commit("Users/setReciverMessage", user);
      this.$store.dispatch("Messages/getByUser", {
        recipientUserId: this.UserReceiver.id,
        userId: this.User.id,
      });
      this.$store.commit("Messages/resetMessages");

      setTimeout(() => {
        this.scrollToBottom();
      }, 150);
    },

    sendPrivateMessage() {
      const socket = this.$socket;
      const recipientUserId = this.UserReceiver.id;
      const message = this.message;
      this.message = "";
      this.scrollToBottom();
      socket.emit("private message", {
        recipientUserId,
        message,
        userId: this.User.id,
        username: this.User.username,
      });
      this.$store.commit("Messages/addCurrentMessage", {
        user_id: this.User.id,
        username: this.User.username,
        content: message,
        owner: true,
        recipient_user_id: recipientUserId,
      });
    },

    scrollToBottom() {
      this.shouldScrollToBottom = !this.shouldScrollToBottom;
    },
  },
};
</script>
<style scoped>
.container-section {
  background-color: var(--soft-dark);
  padding: 40px 80px;
  width: 100%;
  height: 100vh;
}
.content-page {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 25px;
  background-color: var(--soft-black);
  box-shadow: var(--primary-box-shadow);
}

.content-menu {
  width: 30%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: 1px solid var(--soft-gray-border);
}

.content-options {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 12vh;
  padding: 20px 25px;
}

.active-messages {
  height: 78vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.img_test {
  min-width: 45px;
  min-height: 45px;
  background-color: var(--soft-dark);
  border-radius: 50%;
  box-shadow: var(--primary-box-shadow);
}
.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid var(--soft-gray-border);
  cursor: pointer;
}

.info-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-user .username {
  width: 100px;
}

i {
  color: #fff;
}

.status {
  width: 10px;
  height: 10px;
  background-color: var(--soft-dark);
  box-shadow: var(--primary-box-shadow);
  border-radius: 50%;
}

.status.connected {
  background-color: green;
}
.content-chat {
  width: 100%;
}

.capitalize {
  text-transform: capitalize;
}

.container-type-message {
  width: 100%;
  padding: 0px 25px;
}

.container-type-message input {
  width: 90%;
  height: 35px;
  background-color: var(--soft-dark);
  outline: none;
  border: 1px solid var(--soft-gray-border);
  border-radius: 10px;
  color: var(--white-dark);
  padding-left: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.container-type-message button {
  width: 8%;
  height: 35px;
  background-color: var(--bg-button);
  color: var(--white-dark);
  border-radius: 10px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.inner-scroll {
  width: 100%;
  height: 70vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  background: rgb(67, 113, 252);
  background: radial-gradient(
    circle,
    rgba(67, 113, 252, 0.5) 0%,
    rgba(24, 25, 32, 0.5) 100%
  );
}
.container-messages {
  width: 100%;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  justify-content: flex-end;
  display: flex;
}

.content-boas-vindas {
  width: 100%;
  padding: 20px 20px;
}

.content-boas-vindas span {
  color: var(--primary);
  letter-spacing: 2px;
  font-weight: 600;
}
.content-boas-vindas h3 {
  color: var(--white-dark);
}

.container-user-selected {
  display: flex;
  flex-direction: row;
  height: 10vh;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--soft-gray-border);
  padding: 0px 20px;
}

.container-user-selected .img_test {
  border: 1px solid var(--white-dark);
}

#button-menu {
  display: none;
}
@media screen and (max-width: 400px) {
  #button-menu {
    display: inline;
  }
  .container-section {
    padding: 0px;
  }
  .content-page {
    border-radius: 0px;
  }

  .content-menu {
    position: absolute;
    z-index: 999;
    background-color: var(--soft-black);
    left: -300px;
  }
  .inner-scroll {
    height: 80vh;
  }

  .active-menu {
    position: absolute;
    left: 0;
    width: 100%;
  }
  .container-type-message {
    padding: 0px;
  }

  .container-type-message input {
    width: 75%;
  }

  .container-type-message button {
    width: 20%;
  }
}
</style>
