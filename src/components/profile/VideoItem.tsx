import { ActionIcon, Badge, Box, Card, Text, CardSection, Chip, Group, MediaQuery, Menu, Paper, Tooltip } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { Video } from '@prisma/client'
import { IconCheck, IconDots, IconDownload, IconEye, IconEyeOff, IconFileZip, IconTrash, IconVideo, IconX } from '@tabler/icons'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import prettyBytes from 'pretty-bytes'
import React, { FunctionComponent } from 'react'
import Moment from 'react-moment'
import { EndPoints } from '../../constants/GlobalEnums'
import { VideoReq, VideoRes } from '../../pages/api/video'

type VideoItemProps = {
    isUsersProfile: boolean
    video: Video,
}
const VideoItem: FunctionComponent<VideoItemProps> = (props) =>
{
    const { isUsersProfile, video } = props;
    const { data: session } = useSession();
    const router = useRouter();

    const confirmDelete = () =>
    {
        openConfirmModal({
            title: `Delete video '${video.name}'`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this video?
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => { return; },
            onConfirm: () => handleVideoDelete(),
        });
    }


    const handleVideoDelete = async () =>
    {
        let data: VideoReq = {
            userId: session?.user?.id as string,
            id: video.id,
            name: video.name,
            isPublic: video.isPublic,
            size: video.size,
            location: video.location
        }

        await axios.delete(`${window.origin}${EndPoints.VIDEO}`, { data: data }).then(res =>
        {
            let newData = res.data as VideoRes;
            router.push({
                pathname: router.asPath,
            }, undefined, { scroll: false })
            if (newData.success)
            {
                showNotification({
                    message: `Video '${newData.name}' deleted`,
                    icon: <IconCheck />,
                    color: "green"
                })
            }
            else
            {
                showNotification({
                    message: newData.errorMessage,
                    icon: <IconX />,
                    color: "red"
                })
            }
        }).catch(err =>
        {
            showNotification({
                message: err.message,
                icon: <IconX />,
                color: "red"
            })
        })
    }

    const handleVideoVisibility = async () =>
    {
        const visibility = !video.isPublic;
        let data: VideoReq = {
            userId: session?.user?.id as string,
            id: video.id,
            name: video.name,
            isPublic: visibility,
            size: video.size,
            location: video.location
        }
        await axios.put(`${window.origin}${EndPoints.VIDEO}`, data).then(res =>
        {
            let newData = res.data as VideoRes;

            if (newData.success)
            {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    title: "Successfully changed",
                    message: `Video visibility changed to ${newData.isPublic ? "public" : "private"}`,
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

    return (

        <Card style={{ flex: 1 }} shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding>
                <Group position="apart" py="xs">
                    <div>
                        <p style={{ margin: 0 }}>{video.name}</p>
                        <small><Moment local calendar>{video.createdAt}</Moment></small>
                    </div>
                    {isUsersProfile ?
                        <Menu withinPortal position="bottom-end" shadow="sm">
                            <Menu.Target>
                                <ActionIcon>
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item icon={<IconDownload size={14} />}>Download</Menu.Item>
                                <Menu.Item onClick={handleVideoVisibility} icon={video.isPublic ? <IconEyeOff size={14} /> : <IconEye size={14} />}>{video.isPublic ? "Mark as private" : "Mark as public"}</Menu.Item>
                                <Menu.Item onClick={confirmDelete} icon={<IconTrash size={14} />} color="red">
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        : null}
                </Group>
            </Card.Section>
            <Card.Section py="xs" inheritPadding withBorder>
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                    <Group position='center'>
                        <Badge size="sm"><strong>Video size:</strong> {prettyBytes(video.size)}</Badge>
                        {/* <Badge size="sm"><strong>Video lenght:</strong> 100min</Badge>
                        <Badge size="sm"><strong>Video lenght:</strong> 100min</Badge> */}
                    </Group>
                </MediaQuery>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Group position='left'>
                        <Badge size="sm"><strong>Video size:</strong> {prettyBytes(video.size)}</Badge>
                        {/* <Badge size="sm"><strong>Video lenght:</strong> 100min</Badge>
                        <Badge size="sm"><strong>Video lenght:</strong> 100min</Badge> */}
                    </Group>
                </MediaQuery>
            </Card.Section>
        </Card>
    )
}

export default VideoItem