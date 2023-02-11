import { Button, Center, Divider, Group, Paper, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const guest: NextPage = () => {
    const router = useRouter();
    const returnUrl = router.query.returnUrl as string
    const roomName = returnUrl?.split("/")[2]
    const [redirect, setRedirect] = useState()
    const [guestName, setGuestName] = useState<string>("")
    const [guest, setGuest] = useLocalStorage({ key: 'guest', defaultValue: null });


    useEffect(() => {
        setGuestName(`Guest ${Math.floor(Math.random() * 1000)}`)
    }, [])

    const handleGuestJoin = (): void => {
        // setGuest(guest || (guestName))
        alert(guestName)
    }

    return (
        <Center style={{ height: "100%" }}>
            <Paper shadow="sm" radius="lg" p="sm" style={{ width: "50vh" }}>
                <h2 style={{ margin: 0 }}>Joining room '{roomName}'</h2>
                <Divider my={10} />
                <TextInput description="Guests can't change their name" mb={10} disabled value={guestName} label="Username" />
                <Group position='right'>
                    <Button onClick={() => { handleGuestJoin() }}>Join</Button>
                </Group>
            </Paper>
        </Center>
    )
}

export default guest