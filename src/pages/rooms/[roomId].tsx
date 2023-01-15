import { Button, Grid } from '@mantine/core';
import { AspectRatio, MediaQuery, TextInput } from '@mantine/core';
import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import Chat from '../../components/room/Chat';
import { api } from '../../utils/api';


const Room: NextPage = () => {
    const router = useRouter();
    const roomId = router.query.roomId as string;
    //#region TRPC queries
    const joinRoomWs = api.room.joinRoom.useMutation();
    //#endregion

    //#region WS listeners
    api.room.onJoinRoom.useSubscription({ roomId: roomId }, {
        onData(data) {
            //Do something with that data
            console.log(data);
        },
        onError(err) {
            console.log("smth went wrong", err)
        }
    })
    //#endregion

    const sendData = () => {
        joinRoomWs.mutate({ roomId: roomId, message: "Testing" })
    }
    return (
        <Grid m={1} columns={18}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Grid.Col>
                    <AspectRatio ratio={16 / 9}>
                        <video width="100%" height="100%" controls />
                    </AspectRatio>
                    <Button onClick={() => { sendData() }}></Button>
                </Grid.Col>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Grid.Col span={14}>
                    <AspectRatio ratio={16 / 9}>
                        <video width="100%" height="100%" controls />
                    </AspectRatio>
                </Grid.Col>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Grid.Col pos="fixed" style={{ right: "0", width: "100%", height: "100%" }} span={4}>
                    <Chat message='TestMessage' user='TestUser' />
                </Grid.Col>
            </MediaQuery>

        </Grid>
    );
}

export default Room