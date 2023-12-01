<template>
    <div class="container-section">
        <div class="content-page">
            <div class="content-menu">
                <div class="content-options">
                    <span>
                        Úsuario: {{ `${User.username || ""}`.toUpperCase() }}
                    </span>
                    <span>
                        <a>Sair</a>
                    </span>
                </div>
                <div class="active-messages">
                    <div 
                        class="user-card"
                        v-for="(user, index) in Users" :key="index"
                        @click="setReciverMessage(user)"
                    >
                        <div class="img_test"></div>
                        <span>{{ user.username }}</span>
                    </div>
                </div>

            </div>
            <div class="content-chat" v-if="UserReceiver.id">
                <div class="container-user-selected">
                    <div class="img_test"></div>
                    <span>{{ UserReceiver.username }}</span>
                </div>
                <div class="inner-scroll" ref="chatContainer">
                    <div class="container-messages" >
                        <Message 
                            v-for="(message, index) in currentMessages"
                            :key="`message-${index}`"
                            :message="message"
                        />
                    </div>
                </div>
                <div class="container-type-message">
                    <input type="text" v-model="message" @keydown.enter="sendPrivateMessage"/>
                    <button @click="sendPrivateMessage">
                        Send
                    </button>
                </div>
            </div>
            <div class="content-boas-vindas" v-else>
                <h3>
                    Seja bem-vindo(a) Ao <span class="app-name">AWESOME CHAT</span>,
                    Fique a vontade para escolher um usuário e interagir com ele!
                    por favor não se esqueça que ainda estamos em DESENVOLVIMENTO
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
            currentMessages: [],

            shouldScrollToBottom: true,
        }
    },
    watch: {
        shouldScrollToBottom() {
            this.$nextTick(() => {
                this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                console.log(this.$refs.chatContainer.scrollTop);
            });
        },
    },
    beforeMount() {
        this.$store.dispatch("Users/getAllUsers");
    },

    mounted() {
        const socket = this.$socket;

        
        socket.on('private message', (data) => {
            this.currentMessages.push({
                content: data.message,
            })
        });
    },

    computed: {
        User() {
            return this.$store.state.Users.connected
        },
        
        UserReceiver() {
            return this.$store.state.Receiver;
        },

        Users() {
            return this.$store.state.Users.content.filter(user => user.id !== this.User.id);
        },

    },

    methods: {
        setReciverMessage(user) {
            this.$store.commit("setReciverMessage", user)
            this.$store.dispatch("Messages/getByUser", {
                recipientUserId: this.UserReceiver.id,
                userId: this.User.id
            })
        },

        sendPrivateMessage() {
            const socket = this.$socket;
            const recipientUserId = this.UserReceiver.id;
            const message = this.message
            this.currentMessages.push({
                owner: true,
                content: message,
            });
            this.$forceUpdate();
            this.message = "";
            this.scrollToBottom();
            socket.emit("private message", { recipientUserId, message })
        },

        scrollToBottom() {
            this.shouldScrollToBottom = !this.shouldScrollToBottom;
        }
    }
}
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
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.content-menu{
    width: 30%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-right: 1px solid var(--soft-gray-border);
}


.content-options {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    height: 8vh;
    padding: 10px 10px;

}

.active-messages {
    height: 78vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.img_test{
    min-width: 32px;
    min-height: 32px;
    background-color: var(--soft-dark);
    border-radius: 50%;
}
.user-card{
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 5px 10px;
    border-bottom: 1px solid var(--soft-gray-border);
    cursor: pointer;
}

.content-chat{
    width: 100%;
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
    background: rgb(67,113,252);
    background: radial-gradient(circle, rgba(67,113,252,0.5) 0%, rgba(24,25,32,0.5) 100%);
}
.container-messages{

    
    width: 100%;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
    justify-content: flex-end;
    display: flex;
}


.content-boas-vindas{
    width: 100%;
    padding: 20px 20px;
}

.content-boas-vindas span {
    color: var(--primary);
    letter-spacing: 2px;
    font-weight: 600;
}
.content-boas-vindas h3{
    color: var(--white-dark);
}

.container-user-selected{
    display: flex;
    flex-direction: row;
    height: 50px;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--soft-gray-border);
    padding: 0px 20px;
}


.container-user-selected .img_test {
    border: 1px solid var(--white-dark);
}
</style>