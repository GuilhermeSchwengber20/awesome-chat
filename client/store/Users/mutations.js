import User from "@/models/User"
export default {
    handleConnectedUser(state, user) {
        state.connected = new User(user);
    },
    handleUpdateUsers(state, users) {
        state.content = users.map(user => new User(user));
    },
    userLogout(state) {
        state.connected = new User({});
        state.content = [];
        state.Receiver = {}
    },
    
    setReciverMessage(state, payload) {
        state.Receiver = payload;
    }
}