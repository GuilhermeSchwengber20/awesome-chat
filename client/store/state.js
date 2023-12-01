import User from "models/User"

export default () => ({
    API_URL: "http://localhost:3000",
    loading: false,
    Notification: {
        type: "",
        msg: ""
    },
    Receiver: new User({})
})