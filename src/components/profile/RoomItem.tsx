import { ActionIcon, Avatar, Button, Card, Flex, Group, Image, Menu, Text, Tooltip } from '@mantine/core'
import { closeAllModals, openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { ConnectedRooms, Room, User } from '@prisma/client'
import { IconCheck, IconDots, IconDownload, IconEye, IconEyeOff, IconTrash, IconUser, IconUserOff, IconUsers, IconX } from '@tabler/icons'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, FunctionComponent } from 'react'
import Moment from 'react-moment'
import { EndPoints } from '../../constants/GlobalEnums'
import { RoomReq, RoomRes } from '../../pages/api/room'

type RoomItemProps = {
    room: Room & {
        ConnectedRooms: (ConnectedRooms & {
            user: User;
        })[];
    }
    createdTime: Date,
    isUsersProfile: boolean,
}



const RoomItem: FunctionComponent<RoomItemProps> = (props) =>
{
    const { room, createdTime, isUsersProfile } = props
    const { data: session } = useSession();
    const router = useRouter();
    const confirmDelete = () =>
    {
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
    const handleRoomDelete = async () =>
    {
        //only needs one 
        let data: RoomReq =
        {
            id: room.id,
            isPublic: room.isPublic,
            name: room.name,
        }
        await axios.delete(`${window.origin}${EndPoints.ROOM}`, { data: data }).then(res =>
        {
            let newData = res.data as RoomRes;
            if (newData.success)
            {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    message: `Room '${newData.name}' Deleted`,
                    icon: <IconCheck />,
                    color: "green",
                })
            }
            else
            {
                showNotification({
                    message: newData.errorMessage,
                    icon: <IconX />,
                    color: "red",
                })
            }
        }).catch(err =>
        {
            showNotification({
                message: err.message,
                icon: <IconX />,
                color: "red",
            })
        })
    }

    const handleRoomVisibility = async () =>
    {
        const visibility = !room.isPublic;
        let data: RoomReq = {
            id: room.id,
            name: room.name,
            isPublic: visibility,
            coverImage: room.coverImage,
            videoId: room.videoId,

        }
        await axios.put(`${window.origin}${EndPoints.ROOM}`, data).then(res =>
        {
            let newData = res.data as RoomRes;

            if (newData.success)
            {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    title: "Successfully changed",
                    message: `Room visibility changed to ${newData.isPublic ? "public" : "private"}`,
                    color: "green",
                    icon: <IconCheck />
                })
            }
            else
            {
                showNotification({
                    message: newData.errorMessage,
                    icon: <IconX />,
                    color: "red",
                })
            }
        }).catch(err =>
        {
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
                                <Menu.Item onClick={handleRoomVisibility} icon={room.isPublic ? <IconEyeOff size={14} /> : <IconEye size={14} />}>{room.isPublic ? "Mark as private" : "Mark as public"}</Menu.Item>
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
                <Flex>
                    <Group>

                        <Tooltip.Group openDelay={300} closeDelay={100}>
                            <Avatar.Group spacing="sm">
                                {room.ConnectedRooms.length !== 0 ? room.ConnectedRooms.map(user =>
                                {
                                    //Later make it so when more then three users then start showing number
                                    return (
                                        <Tooltip key={user.socketId} label={session?.user?.id === user.user.id ? user.user.name + " (You)" : user.user.name} withArrow>
                                            <Avatar src={user.user.image} radius="xl" >{user.user.name?.charAt(0)}</Avatar>
                                        </Tooltip>
                                    )
                                }) : <Avatar radius="xl" ><IconUserOff /></Avatar>
                                }
                            </Avatar.Group>
                        </Tooltip.Group>
                    </Group>
                    <Group ml="auto" noWrap my={20}>
                        {/* <Link href={`/rooms/${room.id}`} >Test</Link> */}
                        <Button component='a' href={`/rooms/${room.id}`} variant='light' color="green">Join room</Button>
                    </Group>
                </Flex>
            </Card.Section>
        </Card>
    )
}

export default RoomItem