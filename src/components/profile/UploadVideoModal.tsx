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
    handleUploadVideo: () => Promise<void>
}
const UploadVideoModal: FunctionComponent<UploadVideoModalProps> = (props) =>
{
    const { profileUser, uploadVideo, setUploadVideo, handleUploadVideo } = props
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

    const validateFile = async (): Promise<boolean> =>
    {
        console.log("VALIDATE HERE")
        return true;
    }

    return (
        <Modal title="Upload settings" opened={uploadVideo} onClose={() => { setUploadVideo(false); form.reset() }}>
            <form onSubmit={form.onSubmit((values) => { handleUploadVideo() })}>
                <Flex direction="column" rowGap={10} >
                    <Group grow>
                        <TextInput withAsterisk label="Video title" placeholder='Awesome movie' {...form.getInputProps("videoTitle")} />
                        <NativeSelect data={['Public', 'Private']} withAsterisk label="Visibility" />

                    </Group>
                    <Radio.Group
                        name="uploadSelectVideo"
                        label="Do you want to upload new video file"
                        description="This is anonymous"
                        defaultValue='yes'
                    >
                        <Radio value="yes" label="Yes" />
                        <Radio value="no" label="No" />
                    </Radio.Group>
                    <FileInput value={file} onChange={setFile} label="Video" placeholder="Your video" icon={<IconUpload size={14} />} />
                    <Select
                        label="Choose video"
                        placeholder="Pick one"
                        itemComponent={SelectItem}
                        nothingFound="Nothing found"
                        data={data}
                        searchable
                        maxDropdownHeight={400} />
                </Flex>


                <Button type='submit' fullWidth mt="md">
                    Upload
                </Button>
            </form>
        </Modal>
    )
}


//#region Testing stuff
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
    image: string;
    label: string;
    description: string;
}
//#endregion

export default UploadVideoModal
