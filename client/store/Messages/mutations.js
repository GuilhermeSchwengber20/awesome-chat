import Message from "~/models/Message"


export default {
    setCurrentMessages(state, payload) {
        state.currentMessages = payload.map(message => new Message(message));
    },

    setOwnerMessages(state) {
        state.currentMessages.forEach(message => {
            if(message.userOwnerMessage === this.state.Users.connected.id) {
                message.owner = true;
                // VERIFICAR SE TA CHEGANDO AQUI
            }
        })
    },

    addCurrentMessage(state, payload) {
        if(payload) {
            state.currentMessages.push(new Message(payload));
        }
    },

    resetMessages(state) {
        state.currentMessages = [];
    }
}