export default class Message{
    constructor(message) {
        this.username = message.username;
        this.content = message.content;
        this.userOwnerMessage = message.user_id; // fazer um dto no backend futuramente
        this.recipientUserId = message.recipient_user_id; // aqui tb
        this.timestamp = message.timestamp;
        this.owner = message.owner || false;
    }
}