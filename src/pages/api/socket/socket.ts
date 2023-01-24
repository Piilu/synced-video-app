import { Server } from "socket.io"
import { Events } from '../../../constants/events'
import messageHandler from '../../../utils/sockets/messageHandler'

const SocketHandler = (req: any, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    }
    else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io
        const onConnection = (socket: any) => {
            messageHandler(io, socket);
        };

        io.on('connection', onConnection)
    }
    res.end()
}

export default SocketHandler