import { Avatar, Button, FileInput, Flex, Group, Text, Modal, NativeSelect, Select, TextInput, SegmentedControl, Box, Center, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Room, User, Video } from '@prisma/client';
import { IconEye, IconUpload } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import React, { useState, FunctionComponent, SetStateAction, Dispatch, forwardRef } from 'react'

type UploadVideoModalProps = {
    uploadVideo: boolean,
    setUploadVideo: Dispatch<SetStateAction<boolean>>
    profileUser: (User & {
        videos: Video[];
        rooms: Room[];
    }) | null;
    handleUploadVideo: (file: File) => Promise<void>
}
const UploadVideoModal: FunctionComponent<UploadVideoModalProps> = (props) => {
    const { profileUser, uploadVideo, setUploadVideo, handleUploadVideo } = props
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const form = useForm({
        initialValues: {
            videoTitle: '',
            file: '',
        },

        validate: {
            videoTitle: ((value) => (value.length >= 3 ? null : "Title must be at least 3chr long"))
        }
    })

    const validateData = async () => {
        console.log("VALIDATE HERE")
        if (file != null) {
            await handleUploadVideo(file)
        }
    }

    return (
        <Modal title="Upload settings" opened={uploadVideo} onClose={() => { setUploadVideo(false); form.reset() }}>
            <form onSubmit={form.onSubmit((values) => { validateData() })}>
                <Flex direction="column" rowGap={10} >
                    <Group grow>
                        <TextInput withAsterisk label="Video title" placeholder='Awesome movie' {...form.getInputProps("videoTitle")} />
                        <NativeSelect data={['Public', 'Private']} label="Visibility" />
                    </Group>
                    <FileInput withAsterisk value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} />
                </Flex>
                <Button type='submit' fullWidth mt="md">
                    Upload
                </Button>
            </form>
        </Modal>
    )
}


export default UploadVideoModal
