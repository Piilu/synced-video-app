import { Button, FileInput, Flex, Group, Modal, NativeSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { User } from '@prisma/client';
import { IconUpload } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import React, { useState, FunctionComponent, SetStateAction, Dispatch } from 'react'

type UploadVideoModalProps = {
    uploadVideo: boolean,
    setUploadVideo: Dispatch<SetStateAction<boolean>>
    profileUser: User,
}
const UploadVideoModal: FunctionComponent<UploadVideoModalProps> = (props) =>
{
    const { profileUser, uploadVideo, setUploadVideo } = props
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const form = useForm({
        initialValues: {
            videoTitle: '',
            file: '',
        },

        validate: {

        }
    })

    const handleUploadVideo = async () =>
    {
        let result = await validateFile()
        console.log(form.values)
        console.log(file)
    }

    const validateFile = async (): Promise<boolean> =>
    {
        console.log("VALIDATE HERE")
        return true;
    }
    
    return (
        <Modal title="Upload settings" opened={uploadVideo} onClose={() => { setUploadVideo(false); form.reset() }}>
            <form onSubmit={form.onSubmit((values) => { handleUploadVideo() })}>
                <Flex direction="column" rowGap={10}>
                    <Group grow>
                        <TextInput withAsterisk label="Video title" placeholder='Awesome movie' {...form.getInputProps("videoTitle")} />
                        <NativeSelect data={['Public', 'Private']} withAsterisk label="Visibility" />

                    </Group>
                    <FileInput value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} />
                </Flex>
                <Button type='submit' fullWidth mt="md">
                    Upload
                </Button>
            </form>
        </Modal>
    )
}

export default UploadVideoModal