import { ActionIcon, Box, Card, CardSection, Group, MediaQuery, Menu, Paper } from '@mantine/core'
import { IconDots, IconDownload, IconEye, IconEyeOff, IconFileZip, IconTrash, IconVideo } from '@tabler/icons'
import React, { FunctionComponent } from 'react'

type VideoItemProps = {
    isUsersProfile: boolean
}
const VideoItem: FunctionComponent<VideoItemProps> = (props) => {
    const { isUsersProfile } = props;
    return (

        <Card style={{ flex: 1 }} shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding>
                <Group position="apart" py="xs">
                    <div>
                        <p style={{ margin: 0 }}>Movie/Video name</p>
                        <small>Date time</small>
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
                                <Menu.Item icon={<IconEyeOff size={14} />}>Mark as private</Menu.Item>
                                <Menu.Item icon={<IconTrash size={14} />} color="red">
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
                        <small><strong>Video lenght:</strong> 100min</small>
                        <small><strong>Video lenght:</strong> 100min</small>
                        <small><strong>Video lenght:</strong> 100min</small>
                        <small><strong>Video lenght:</strong> 100min</small>
                    </Group>
                </MediaQuery>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Group position='left'>
                        <small><strong>Video lenght:</strong> 100min</small>
                        <small><strong>Video lenght:</strong> 100min</small>
                        <small><strong>Video lenght:</strong> 100min</small>
                        <small><strong>Video lenght:</strong> 100min</small>
                    </Group>
                </MediaQuery>
            </Card.Section>
        </Card>
    )
}

export default VideoItem