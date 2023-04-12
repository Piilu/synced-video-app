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
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<VideoSmall[]>([]);
    const [value, setValue] = useDebouncedState<string | undefined>("", 300);

    const { data: session } = useSession()
    const router = useRouter()
    const form = useForm({
        initialValues: {
            title: '',
            visibility: '1',
        },
        validate:
        {
            title: (value) => (value.length > 0 ? null : "Title is required")
        }
    })

    useEffect(() =>
    {
        form.setValues({ title: "", visibility: "1" });
    }, [createRoom])

    const handleRoomCreate = async () =>
    {
        let data: RoomReq =
        {
            name: form.values.title,
            isPublic: form.values.visibility == "1" ? true : false,
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

    const searchVideos = async (name: string) =>
    {
        let data: RoomReq =
        {
            userId: session?.user?.id,
            isPublic: false,
            name: name,
            useSearch: true,
        }

        await axios.get(`${window.origin}${EndPoints.VIDEO}`, { params: data }).then(res =>
        {
            let newData = res.data as VideoRes;
            if (newData.success)
            {
                console.log(newData.videos)
                const data2 = newData.videos !== undefined ? newData.videos.map((item) => ({ ...item, value: item.name })) : null;
                setData(data2)
            }

        }).catch(err =>
        {
            console.log(err.message)
        })
    }

    useEffect(() =>
    {
        if (value !== undefined)
        {
            console.log("Value: " + value)
            searchVideos(value)
        }

    }, [value])
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

                    <Select
                        label="Choose video"
                        placeholder="Pick one"
                        itemComponent={SelectItem}
                        nothingFound="Nothing found"
                        data={data}
                        onSearchChange={(e) => { setValue(e) }}
                        searchable
                        withAsterisk
                        filter={(value, item) =>
                            item.value.toLowerCase().includes(value.toLowerCase().trim())
                        }
                        maxDropdownHeight={400} />
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


const data = [
    {
        image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
        label: 'Bender Bending Rodríguez',
        value: 'Bender Bending Rodríguez',
        description: 'Fascinated with cooking',
    },

    {
        image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
        label: 'Carol Miller',
        value: 'Carol Miller',
        description: 'One of the richest people on Earth',
    },
    {
        image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
        label: 'Homer Simpson',
        value: 'Homer Simpson',
        description: 'Overweight, lazy, and often ignorant',
    },
    {
        image: 'https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png',
        label: 'Spongebob Squarepants',
        value: 'Spongebob Squarepants',
        description: 'Not just a sponge',
    },
];

interface ItemProps extends React.ComponentPropsWithoutRef<'div'>
{
    name: string;
    isPublic: boolean;
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ name, isPublic, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                {/* <Avatar src={image} /> */}

                <div>
                    <Text size="sm">{name}</Text>
                    <Text size="xs" opacity={0.65}>
                        {/* {description} */}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

export default CreateRoomModal