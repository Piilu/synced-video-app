import { Events } from "../../constants/GlobalEnums";
import { RoomMessage, VideoAction } from "../../constants/schema";

export default (io: any, socket: any) => {
    const joinRoom = async (data: RoomMessage) => {
        socket.join(data.roomId)

        const user = await prisma?.connectedRooms.upsert({
            where: {
                userId: data.user?.id,
            },
            update: {
                socketId: socket.id,
            },
            create: {
                userId: data.user?.id,
                roomId: data.roomId,
                socketId: socket.id,
            },

        })
        console.log(`User ${data.user?.name} joined: `, socket.id)
        socket.to(data.roomId).emit(Events.JOIN_ROOM_UPDATE, data)

    };

    const leaveRoom = async () => {
        console.log("__________________________")
        const user = await prisma?.connectedRooms.findFirst({
            where: {
                socketId: socket.id,
            },
            include: {
                user: true,
            }
        })

        await prisma?.connectedRooms.deleteMany({
            where: {
                socketId: socket.id,
            }
        });

        console.log(`User ${user?.user.name} left ${user?.roomId}!!`)
        socket.leave(user?.roomId)
        const data: RoomMessage = {
            message: "Left",
            roomId: user?.roomId,
            user: user?.user,
        }
        socket.to(user?.roomId).emit(Events.LEAVE_ROOM_UPDATE, user)
    };

    const roomSendMessage = (data: RoomMessage) => {
        console.log(data);
        socket.to(data.roomId).emit(Events.SEND_MESSAGE_UPDATE, data)
    };

    const roomStartPlaying = (data: VideoAction) => {
        socket.to(data.roomId).emit(Events.VIDEO_PLAY_UPDATE, data)
    };

    const roomStopPlaying = (data: VideoAction) => {
        socket.to(data.roomId).emit(Events.VIDEO_PAUSE_UPDATE, data)
    };

    const roomSeek = (data: VideoAction) => {
        socket.to(data.roomId).emit(Events.VIDEO_SEEK_UPDATE, data)
    };

    socket.on(Events.SEND_MESSAGE, roomSendMessage)

    socket.on(Events.JOIN_ROOM, joinRoom)
    socket.on(Events.DISSCONNECT, leaveRoom)
    // socket.on(Events.LEAVE_ROOM, leaveRoom)
    socket.on(Events.VIDEO_PLAY, roomStartPlaying)
    socket.on(Events.VIDEO_PAUSE, roomStopPlaying)
    socket.on(Events.VIDEO_SEEK, roomSeek)
};

