import { Grid } from '@mantine/core';
import { AspectRatio, MediaQuery, TextInput } from '@mantine/core';
import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import React from 'react'
import Chat from '../../components/room/Chat';

const Room: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Grid m={1} columns={18}>

            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Grid.Col>
                    <AspectRatio ratio={16 / 9}>
                        <video width="100%" height="100%" controls />
                    </AspectRatio>
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