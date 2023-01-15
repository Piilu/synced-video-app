import ws from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './api/root';
import { createTRPCContext } from './api/trpc';

const wss = new ws.Server({
    port: 3001,
})

const handler = applyWSSHandler({ wss, createContext: createTRPCContext, router: appRouter })

wss.on('connection', () => {
    console.log(`++ ws conntection ${wss.clients.size}`)
    wss.on('close', () => {
        console.log(`-- ws conntection ${wss.clients.size}`)
    })
})
console.log(`ws server started ✅`)
process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
  });