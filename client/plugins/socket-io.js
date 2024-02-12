import Vue from "vue";
import io from "socket.io-client";

const socket = io("https://awesomechat-api.onrender.com/");

Vue.prototype.$socket = socket;
