import { Events } from "../../constants/GlobalEnums";
import { RoomMessage, VideoAction } from "../../constants/schema";

export default (io: any, socket: any) =>
{
    const joinRoom = async (data: RoomMessage) =>
    {
        socket.join(data.roomId)
        if (data.isGuest)
        {
            await prisma?.connectedRooms.deleteMany({ //for now
                where: {
                    guestId: data.user?.id,
                    roomId: data.roomId,
                }
            })
            const user = await prisma?.connectedRooms.upsert({
                where: {
                    socketId: socket.id,
                },
                update: {
                    socketId: socket.id,
                },
                create: {
                    isGuest: true,
                    guestId: data.user?.id,
                    roomId: data.roomId,
                    socketId: socket.id,
                },

            })
        }
        else
        {
            await prisma?.connectedRooms.deleteMany({ //for now
                where: {
                    userId: data.user?.id,
                    roomId: data.roomId,
                }
            })
            const user = await prisma?.connectedRooms.upsert({
                where: {
                    socketId: socket.id,
                },
                update: {
                    socketId: socket.id,
                },
                create: {
                    isGuest: false,
                    userId: data.user?.id,
                    roomId: data.roomId,
                    socketId: socket.id,
                },

            })
        }

        console.log("----------------------------------------------")
        console.log(`User ${data.user?.name} joined: `, socket.id)
        console.log("----------------------------------------------")
        socket.to(data.roomId).emit(Events.JOIN_ROOM_UPDATE, data)
        await getRoomData(data.roomId);
    };

    const leaveRoom = async () =>
    {
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
            roomId: user?.roomId as string,
            user: user?.user,
        }
        socket.to(user?.roomId).emit(Events.LEAVE_ROOM_UPDATE, user)
        await getRoomData(user?.roomId as string)
    };

    const roomSendMessage = (data: RoomMessage) =>
    {
        socket.to(data.roomId).emit(Events.SEND_MESSAGE_UPDATE, data)
    };

    const playVideo = (data: VideoAction) =>
    {
        socket.to(data.roomId).emit(Events.VIDEO_PLAY_UPDATE, data)
    };

    const pauseVideo = (data: VideoAction) =>
    {
        socket.to(data.roomId).emit(Events.VIDEO_PAUSE_UPDATE, data)
    };

    const roomSeek = (data: VideoAction) =>
    {
        socket.to(data.roomId).emit(Events.VIDEO_SEEK_UPDATE, data)
    };

    const getRoomData = async (roomId: string) =>
    {

        const roomData = await prisma?.room.findUnique({
            where: {
                id: roomId,
            },
            include: {
                user: true,
                video: true,
                ConnectedRooms: true,
            }
        })
        console.log("Updated room data")
        io.to(roomId).emit(Events.GET_ROOM_DATA_UPDATE, roomData)
    }

    socket.on(Events.GET_ROOM_DATA, getRoomData)
    socket.on(Events.SEND_MESSAGE, roomSendMessage)
    socket.on(Events.JOIN_ROOM, joinRoom)
    socket.on(Events.DISSCONNECT, leaveRoom)
    socket.on(Events.LEAVE_ROOM, leaveRoom)
    socket.on(Events.VIDEO_PLAY, playVideo)
    socket.on(Events.VIDEO_PAUSE, pauseVideo)
    socket.on(Events.VIDEO_SEEK, roomSeek)
};

