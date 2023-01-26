import { Events } from "../../constants/events";
import type { SendMessageTest } from "../../constants/schema";

export default (io: any, socket: any) => {
    const sendMessage = (msg: SendMessageTest) => {
        socket.emit(Events.SEND_MESSAGE_UPDATE, msg)
    };
    socket.on(Events.SEND_MESSAGE, sendMessage)
};

