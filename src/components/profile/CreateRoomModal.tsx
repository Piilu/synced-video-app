import { Avatar, Button, FileInput, Text, Flex, Group, Modal, NativeSelect, Radio, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { Video } from '@prisma/client'
import { useDebouncedState } from '@mantine/hooks';
import { IconCheck, IconUpload, IconX } from '@tabler/icons'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState, Dispatch, SetStateAction, FunctionComponent, forwardRef } from 'react'
import { EndPoints } from '../../constants/GlobalEnums'
import { VideoSmall } from '../../constants/schema'
import { RoomReq, RoomRes } from '../../pages/api/rooms'
import { VideoRes } from '../../pages/api/videos'
import VideoSearch from '../custom/search/VideoSearch';

type CreateRoomModalProps = {
    createRoom: boolean,
    setCreateRoom: Dispatch<SetStateAction<boolean>>,
    videos: Video[] | undefined,
}
const CreateRoomModal: FunctionComponent<CreateRoomModalProps> = (props) =>
{
    const { createRoom, setCreateRoom, videos } = props
    const [loading, setLoading] = useState<boolean>(false)
    const [newVideo, setNewVideo] = useState<"yes" | "no">("no")
    const [data, setData] = useState<VideoSmall[]>([]);
    const [value, setValue] = useDebouncedState<string | undefined>("", 300);

    const { data: session } = useSession()
    const router = useRouter()
    const form = useForm({
        initialValues: {
            title: '',
            visibility: '1',
            video: '0',
        },
        validate:
        {
            title: (value) => (value.length > 0 ? null : "Title is required")
        }
    })

    useEffect(() =>
    {
        form.setValues({ title: "", visibility: "1", video: "0" });
    }, [createRoom])

    const handleRoomCreate = async () =>
    {
        console.log("ID:" + form.values.video.split("|")[1]?.trim() as string)
        let data: RoomReq =
        {
            name: form.values.title,
            isPublic: form.values.visibility == "1" ? true : false,
            videoId: parseInt(form.values.video.split("|")[1]?.trim() as string)
        };
        setLoading(true);
        await axios.post(`${window.origin}${EndPoints.ROOM}`, data).then(res =>
        {
            let newData = res.data as RoomRes;
            if (newData.success)
            {
                router.replace(router.asPath, undefined, { scroll: false });
                showNotification({
                    message: "New room created",
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
        }).finally(() =>
        {
            setLoading(false);
            setCreateRoom(false);
        })

    }
   
    return (
        <Modal title="Create a room" opened={createRoom} onClose={() => { setCreateRoom(false) }}>
            <form onSubmit={form.onSubmit((values) => { handleRoomCreate() })}>
                <Flex direction="column" rowGap={10}>
                    <Group grow>
                        <TextInput withAsterisk label="Room title" placeholder='Awesome movie' {...form.getInputProps("title")} />
                        <Select
                            label="Visibility"
                            data={selectData}
                            {...form.getInputProps("visibility")}
                        />

                    </Group>
                    <VideoSearch label='Choose video' notFoundLabel='Nothing found' isAsterisk form={form} />
                </Flex>
                <Button loading={loading} type='submit' fullWidth mt="md">
                    Create
                </Button>
            </form>
        </Modal>
    )
}

const selectData = [
    { value: "1", label: "Public" },
    { value: "2", label: "Private" },
];

export default CreateRoomModal