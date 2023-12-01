export default class User {
    constructor({id, username, password, email}) {
        this.id = id || "";
        this.username = username || "";
        this.password = password || "";
        this.email = email || "";
    }

    userLogin({username, password}) {
        return {
            username,
            password
        }
    }
}