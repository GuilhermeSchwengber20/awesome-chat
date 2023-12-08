import Vue from 'vue';
import io from 'socket.io-client';



const socket = io('http://localhost:3030'); 

Vue.prototype.$socket = socket;