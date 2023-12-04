export default class User {
    constructor({id, username, password, email, is_connected}) {
        this.id = id || "";
        this.username = username || "";
        this.password = password || "";
        this.email = email || "";
        this.isConnected = is_connected
    }

    userLogin({username, password}) {
        return {
            username,
            password
        }
    }
}