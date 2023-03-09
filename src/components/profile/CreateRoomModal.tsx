import { Avatar, Button, FileInput,Text, Flex, Group, Modal, NativeSelect, Radio, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconUpload, IconX } from '@tabler/icons'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState, Dispatch, SetStateAction, FunctionComponent, forwardRef } from 'react'
import { EndPoints } from '../../constants/GlobalEnums'
import { RoomReq, RoomRes } from '../../pages/api/room'

type CreateRoomModalProps = {
    createRoom: boolean,
    setCreateRoom: Dispatch<SetStateAction<boolean>>
}
const CreateRoomModal: FunctionComponent<CreateRoomModalProps> = (props) => {
    const { createRoom, setCreateRoom } = props
    const [loading, setLoading] = useState<boolean>(false)
    const [newVideo, setNewVideo] = useState<"yes" | "no">("no")
    const [file, setFile] = useState<File | null>(null);
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

    useEffect(() => {
        form.setValues({ title: "", visibility: "1" });
    }, [createRoom])

    const handleRoomCreate = async () => {
        let data: RoomReq =
        {
            name: form.values.title,
            isPublic: form.values.visibility == "1" ? true : false,
        };
        setLoading(true);
        await axios.post(`${window.origin}${EndPoints.ROOM}`, data).then(res => {
            let newData = res.data as RoomRes;
            if (newData.success) {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    message: "New room created",
                    icon: <IconCheck />,
                    color: "green"
                })
            }
            else {
                showNotification({
                    message: newData.errorMessage,
                    icon: <IconX />,
                    color: "red"
                })
            }

        }).catch(err => {
            showNotification({
                message: err.message,
                icon: <IconX />,
                color: "red"
            })
        }).finally(() => {
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
                    <Radio.Group
                        name="uploadSelectVideo"
                        label="Do you want to upload new video file"
                        onChange={e => { setNewVideo(e) }}
                        value={newVideo}
                    >
                        <Radio value="yes" label="Yes" />
                        <Radio value="no" label="No" />
                    </Radio.Group>
                    {newVideo === "yes"
                        ?
                        <FileInput withAsterisk value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} />
                        :
                        <Select
                            label="Choose video"
                            placeholder="Pick one"
                            itemComponent={SelectItem}
                            nothingFound="Nothing found"
                            data={data}
                            searchable
                            withAsterisk
                            maxDropdownHeight={400} />
                    }
                    {/* <FileInput value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} /> */}
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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} />

                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

export default CreateRoomModal