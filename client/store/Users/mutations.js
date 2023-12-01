import User from "@/models/User"
export default {
    handleConnectedUser(state, user) {
        state.connected = new User(user);
    },
    handleUpdateUsers(state, users) {
        state.content = users.map(user => new User(user));
    }
}