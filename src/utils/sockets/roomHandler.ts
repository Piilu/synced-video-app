import { Events } from "../../constants/events";
import type { SendMessageTest } from "../../constants/schema";

export default (io: any, socket: any) => {
    const joinRoom = (data: SendMessageTest) => {
        socket.join(data.roomId)
        console.log("Join room 123")
        socket.to(data.roomId).emit(Events.JOIN_ROOM_UPDATE, data)
    };

    const leaveRoom = (data: SendMessageTest) => {
        console.log(`User ${data.user} left ${data.roomId}!!`)
        socket.leave(data.roomId)
        socket.to(data.roomId).emit(Events.LEAVE_ROOM_UPDATE, data)
    };

    const roomSendMessage = (data: SendMessageTest) => {
        socket.to(data.roomId).emit(Events.SEND_MESSAGE_UPDATE, data)
    };

    socket.on(Events.SEND_MESSAGE, roomSendMessage)

    socket.on(Events.JOIN_ROOM, joinRoom)
    socket.on(Events.DISSCONNECT, leaveRoom)
    socket.on(Events.LEAVE_ROOM, leaveRoom)
};

