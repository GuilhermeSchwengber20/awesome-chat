<template>
  <div class="container-section">
    <div class="content-page">
        <div class="content-login">
            <h3>AWESOME CHAT</h3>
            <Notification v-if="$store.state.Notification.msg !== ''" />
            <div :class="`container-inputs ${view === 'cadastrar' ? 'register' : ''}`">
                <div class="input-group">
                    <label for="username"> Username </label>
                    <input 
                        type="text"
                        id="username"
                        autocomplete="off"
                        v-model="User.username"
                        @keydown.enter="nextInput('password')"
                    />
                </div>
                <div class="input-group" v-if="view === 'cadastrar'">
                    <label for="email"> Email </label>
                    <input 
                        type="text"
                        id="email"
                        autocomplete="off"
                        v-model="User.email"
                        @keydown.enter="nextInput('password')"
                    />
                </div>
                <div class="input-group">
                    <label for="password"> Password </label>
                    <input 
                        type="password"
                        id="password"
                        @keydown.enter="loginAutenticate"
                        v-model="User.password"
                    />
                </div>
                <button class="button-send" id="enviar" @click="loginAutenticate">
                    Enviar
                </button>
                <div class="container-buttons">
                    <button @click="changeView('login')" id="login">
                        Login
                    </button>
                    <button @click="changeView('cadastrar')" id="cadastrar">
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
        <div class="image-inspiration-content">
            <span id="inspiration-msg">"Todo dia uma mensagem inspiradora pra você!"</span>
            <img
                src="../assets/images/login-page-image.jpg"
                Alt="image da pagina de login"
            />
        </div>
    </div>
  </div>
</template>

<script>
import User from "../models/User";
export default {
  name: "LoginPage",

  data() {
    return {
        User: new User({}),
        view: "login",
    }
  },

  mounted() {
    this.changeView('login');
  },

  methods: {
    updateUserConnected(userId) {
        const socket = this.$socket;
        socket.emit("userLoged", {
            userId,
            isConnected: true
        })
    },

    changeView(view) {
        this.clearForm();
        this.view = view;
        const registerButton = document.getElementById('cadastrar');
        const loginButton = document.getElementById('login');
        
        if(view === 'login') {
            if(registerButton.classList.contains("selected")) {
                registerButton.classList.remove("selected");
            }
            loginButton.classList.add("selected");
        }
        if(view === 'cadastrar') {
            if(loginButton.classList.contains("selected")) {
                loginButton.classList.remove("selected");
            }
            registerButton.classList.add("selected");
        }
    },

    clearForm() {
        this.User = new User({})
    },

    async loginAutenticate() {
        this.User = this.User.userLogin(this.User);
        const res = await this.$store.dispatch("Users/login", this.User);
        if(res?.success) {
            this.updateUserConnected(this.$store.state.Users.connected.id)
            setTimeout(() => {
                this.$router.push("/chat");
            }, 150);
        }
        this.User = new User({});
    },

    nextInput(id) {
        const input = document.getElementById(id)
        if(input) {
            input.focus()
        }
    }
  }

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
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.content-login {
  width: 40%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: var(--soft-black);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content-login h3{
    color: var(--primary);
    font-weight: 600;
    letter-spacing: 3px;
    font-size: 24px;
    margin-bottom: 10px;
}

.container-inputs{
    height: 45vh;
    border: 1px solid var(--soft-dark);
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 10px 20px;
    border-radius: 10px;
    gap: 15px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.register {
    height: 55vh;
}

.input-group{
    display: flex;
    flex-direction: column;
}

.input-group label{
    color: var(--white-dark);
    margin-bottom: 5px;
}

.input-group input {
    height: 35px;
    background-color: var(--soft-dark);
    border: none;
    border-radius: 5px;
    color: var(--white-dark);
    padding-left: 10px;
}

.container-inputs button{
    width: 100%;
    height: 35px;
    font-size: 14px;
   
    border: none;
    border-radius: 5px;
    transition: all 0.2s ease-in;
    letter-spacing: 1px;
    cursor: pointer;
}

.button-send {
    color: var(--white-dark);
    background-color: var(--bg-button);
}

.container-inputs .button-send:hover {
    color: var(--bg-button);
    background-color: var(--soft-black);
    border: 1px solid var(--bg-button);
}


#inspiration-msg{
    position: absolute;
    top: 300px;
    right: 270px;
    font-size: 24px;
    width: 350px;
    text-align: center;
}

.image-inspiration-content{
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
}
.image-inspiration-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.container-buttons {
    display: flex;
    width: 100%;
    gap: 15px;
}

.container-buttons button {
    background-color: transparent;
    border: 1px solid var(--primary);
    color: #FFF;
}
.container-buttons button.selected {
    background-color: var(--primary);
}
</style>