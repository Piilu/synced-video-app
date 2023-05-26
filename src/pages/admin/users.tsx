import { GetServerSideProps } from 'next'
import React, { FunctionComponent } from 'react'
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { useSession } from 'next-auth/react';
import { Button, Card, Container, Group, Text, TextInput } from '@mantine/core';
import { User } from '@prisma/client';
import axios from 'axios';
import { EndPoints } from '../../constants/GlobalEnums';
import { UsersReqBody } from '../api/admin';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
    const session = await getServerAuthSession(ctx);
    if (session?.user?.role !== "SUPERADMIN") return { redirect: { destination: "/", permanent: false } }

    const users = await prisma?.user.findMany({
    })
    return { props: { session, users } }

}

type UsersProps = {
    users: User[]
}
const users: FunctionComponent<UsersProps> = (props) =>
{
    const { users } = props
    const { data: session } = useSession();

    const handleChange = async (user: User, maxGb: string) =>
    {
        await axios.put(`${window.origin}${EndPoints.ADMIN}`, { userId: session?.user?.id, maxGb: parseInt(maxGb) }).then((res) =>
        {
            const newData = res.data as UsersResBody;
            if (newData.success)
            {
                showNotification({
                    title: "User storage updated",
                    message: `User name ${user.name} storage updated to ${newData.maxGb / 1000000000} GB`,
                    icon: <IconCheck />,
                    color: "green"
                })
            }
        })
    }
    return (
        <Container>
            <h2>Users</h2>

            {users.length != 0 ? users.map((user) =>
            {
                return (
                    <Card key={user.id}>
                        <Group noWrap>
                            <Text>{user.name}</Text>
                            <TextInput style={{ marginLeft: "auto" }} type='number' defaultValue={user.storage} onBlur={(e) => handleChange(user, e.currentTarget.value)} />
                        </Group>
                    </Card>
                )
            }) : null}
        </Container>
    )
}

export default users
