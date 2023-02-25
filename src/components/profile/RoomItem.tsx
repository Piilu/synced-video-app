import { ActionIcon, Button, Card, Group, Image, Menu } from '@mantine/core'
import { IconDots, IconDownload, IconEyeOff, IconTrash } from '@tabler/icons'
import React from 'react'

const RoomItem = () => {
    return (
        <Card shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding>
                <Group position="apart" py="xs">
                    <div>
                        <p style={{ margin: 0 }}>Room name</p>
                        <small>Date time</small>
                    </div>
                </Group>
            </Card.Section>
            <Card.Section>
                <Image src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={160}
                    alt="Norway" />
            </Card.Section>
            <Card.Section inheritPadding>
                <Group position='right' noWrap my={20}>
                    <Button variant='light' color="green">Some button</Button>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default RoomItem