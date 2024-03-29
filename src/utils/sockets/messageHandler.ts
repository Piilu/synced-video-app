import { Events } from "../../constants/GlobalEnums";
import type { SendMessageTest } from "../../constants/schema";

export default (io: any, socket: any) => {
    const sendMessage = (msg: SendMessageTest) => {
        socket.broadcast.emit(Events.SEND_MESSAGE_UPDATE, msg)
    };
    socket.on(Events.SEND_MESSAGE, sendMessage)
};

