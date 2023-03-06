import { ActionIcon, Button, Card, Group, Image, Menu, Text } from '@mantine/core'
import { closeAllModals, openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { Room } from '@prisma/client'
import { IconCheck, IconDots, IconDownload, IconEye, IconEyeOff, IconTrash, IconX } from '@tabler/icons'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState, FunctionComponent } from 'react'
import Moment from 'react-moment'
import { EndPoints } from '../../constants/GlobalEnums'
import { RoomPostReq, RoomPostRes } from '../../pages/api/room'

type RoomItemProps = {
    room: Room,
    createdTime: Date,
    isUsersProfile: boolean,
}



const RoomItem: FunctionComponent<RoomItemProps> = (props) => {
    const { room, createdTime, isUsersProfile } = props
    const router = useRouter();
    const confirmDelete = () => {
        openConfirmModal({
            title: `Delete room '${room.name}'`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this room?
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => { return; },
            onConfirm: () => handleRoomDelete(),
        });
    }
    const handleRoomDelete = async () => {
        //only needs one 
        let data: RoomPostReq =
        {
            id: room.id,
            isPublic: room.isPublic,
            name: room.name,
        }
        await axios.delete(`${window.origin}${EndPoints.ROOM}`, { data: data }).then(res => {
            let newData = res.data as RoomPostRes;
            if (newData.success) {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    message: `Room '${newData.name}' Deleted`,
                    icon: <IconCheck />,
                    color: "green",
                })
            }
            else {
                showNotification({
                    message: newData.errorMessage,
                    icon: <IconX />,
                    color: "red",
                })
            }
        }).catch(err => {
            showNotification({
                message: err.message,
                icon: <IconX />,
                color: "red",
            })
        })
    }
    { room.videoId }
    return (
        <Card shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding>
                <Group position="apart" py="xs">
                    <div>
                        <p style={{ margin: 0 }}>{room.name}{room.isPublic}</p>
                        <small><Moment local calendar>{createdTime}</Moment></small>
                    </div>
                    {isUsersProfile ?
                        <Menu withinPortal position="bottom-end" shadow="sm">
                            <Menu.Target>
                                <ActionIcon>
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                {room.videoId != null ? <Menu.Item icon={<IconDownload size={14} />}>Download</Menu.Item> : null}
                                <Menu.Item icon={room.isPublic ? <IconEyeOff size={14} /> : <IconEye size={14} />}>{room.isPublic ? "Mark as private" : "Mark as public"}</Menu.Item>
                                <Menu.Item onClick={confirmDelete} icon={<IconTrash size={14} />} color="red">
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        : null}

                </Group>
            </Card.Section>
            <Card.Section>
                <Image src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={160}
                    alt="Norway" />
            </Card.Section>
            <Card.Section inheritPadding>
                <Group position='right' noWrap my={20}>
                    <Button component='a' href={`/rooms/${room.id}`}  variant='light' color="green">Join room</Button>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default RoomItem