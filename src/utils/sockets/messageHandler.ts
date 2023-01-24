import { Events } from "../../constants/events";
import { SendMessage } from "../../constants/schema";

export default (io: any, socket:any) => {
    const sendMessage = (msg: SendMessage) => {
        socket.broadcast.emit(Events.ON_SOCKET_TEST, msg)
    };
    socket.on(Events.SOCKET_TEST, sendMessage)
};

