import { Avatar, Button, FileInput, Flex, Group, Text, Modal, NativeSelect, Select, TextInput, SegmentedControl, Box, Center, Radio, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Room, User, Video } from '@prisma/client';
import { IconAlertCircle, IconEye, IconUpload } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import React, { useState, FunctionComponent, SetStateAction, Dispatch, forwardRef, useEffect } from 'react'
import { VideoReq } from '../../pages/api/videos';

type UploadVideoModalProps = {
    uploadVideo: boolean,
    setUploadVideo: Dispatch<SetStateAction<boolean>>
    profileUser: (User & {
        videos: Video[];
        rooms: Room[];
    }) | null;
    handleUploadVideo: (file: File, data: VideoReq) => Promise<void>
}
const UploadVideoModal: FunctionComponent<UploadVideoModalProps> = (props) =>
{
    const { profileUser, uploadVideo, setUploadVideo, handleUploadVideo } = props
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<"none" | "block">("none");
    const form = useForm({
        initialValues: {
            videoTitle: '',
            visibility: '1',
            // file: '',
        },

        validate: {
            videoTitle: ((value) => (value.length >= 3 ? null : "Title must be at least 3chr long"))
        }
    })

    useEffect(() =>
    {
        form.setValues({ videoTitle: "", visibility: "1" });
        setFile(null);
        setLoading(false);
        setError("none");
    }, [uploadVideo])

    const validateData = async () =>
    {
        if (file != null)
        {
            if (file?.type != "video/mp4")
            {
                console.log(file)
                setError("block")
                return;
            }

            setError("none")
            setLoading(true)
            let data: VideoReq = {
                name: form.values.videoTitle,
                isPublic: form.values.visibility == "1" ? true : false,
                size: file.size,
                location: `./videos/${session?.user?.id}/${file.name}`,
                userId: session?.user?.id as string
            }
            console.log(form.values)
            await handleUploadVideo(file, data)
        }
    }

    return (
        <Modal closeOnClickOutside={false} title="Upload settings" opened={uploadVideo} onClose={() => { setUploadVideo(false); form.reset() }}>
            <Alert style={{ display: error }} icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
                File is in wrong format. Only .mp4 files are allowed
            </Alert>
            <form onSubmit={form.onSubmit((values) => { validateData() })}>
                <Flex direction="column" rowGap={10} >
                    <Group grow>
                        <TextInput withAsterisk label="Video title" placeholder='Awesome movie' {...form.getInputProps("videoTitle")} />
                        <Select
                            label="Visibility"
                            data={selectData}
                            {...form.getInputProps("visibility")}
                        />
                    </Group>
                    <FileInput accept="video/mp4" withAsterisk value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} />
                </Flex>
                <Button loading={loading} type='submit' fullWidth mt="md">
                    Upload
                </Button>
            </form>
        </Modal>
    )
}




const selectData = [
    { value: "1", label: "Public" },
    { value: "2", label: "Private" },
];


export default UploadVideoModal
