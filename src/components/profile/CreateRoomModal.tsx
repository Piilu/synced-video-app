import { Button, FileInput, Flex, Group, Modal, NativeSelect, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconUpload, IconX } from '@tabler/icons'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { EndPoints } from '../../constants/GlobalEnums'
import { RoomPostReq, RoomPostRes } from '../../pages/api/room'

type CreateRoomModalProps = {
    createRoom: boolean,
    setCreateRoom: Dispatch<SetStateAction<boolean>>
}
const CreateRoomModal: FunctionComponent<CreateRoomModalProps> = (props) =>
{
    const { createRoom, setCreateRoom } = props
    const [loading, setLoading] = useState<boolean>(false)
    const { data: session } = useSession()
    const router = useRouter()
    const form = useForm({
        initialValues: {
            title: '',
        },
        validate:
        {
            title: (value) => (value.length > 0 ? null : "Title is required")
        }
    })

    useEffect(() =>
    {
        form.setValues({ title: "" });
    }, [createRoom])

    const handleRoomCreate = async () =>
    {
        let data: RoomPostReq =
        {
            name: form.values.title,
            isPublic: false,
        };
        setLoading(true);
        await axios.post(`${window.origin}${EndPoints.ROOM}`, data).then(res =>
        {
            let newData = res.data as RoomPostRes;
            if (newData.success)
            {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
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
                        <NativeSelect data={['Public', 'Private']} label="Visibility" />

                    </Group>
                    {/* <FileInput value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} /> */}
                </Flex>
                <Button loading={loading} type='submit' fullWidth mt="md">
                    Create
                </Button>
            </form>
        </Modal>
    )
}

export default CreateRoomModal