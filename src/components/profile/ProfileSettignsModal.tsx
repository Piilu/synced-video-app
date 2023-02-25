import { Modal, Flex, Group, TextInput, Textarea, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import { IconCheck, IconX } from '@tabler/icons';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import { EndPoints } from '../../constants/GlobalTypes';
import { UserReqBody, UserResBody } from '../../pages/api/profile/user';
//Note: States not working in modalmanger

type ProfileSettignsModalProps = {
    profileUser: User,
    setEditProfile: Dispatch<SetStateAction<boolean>>,
    editProfile: boolean,
}
const ProfileSettignsModal: FunctionComponent<ProfileSettignsModalProps> = (props) =>
{
    const { profileUser, editProfile, setEditProfile } = props
    const { data: session } = useSession();

    const profileFormData = useForm({
        initialValues: {
            email: profileUser.email as string,
            name: profileUser.name as string,
            comment: profileUser.bio as string,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            name: (value) => (value.length >= 3 && value.length <= 20 ? null : "Invalid name. Maximum 20 and minimum 3 characters "),
            comment: (value) => (value.length <= 191 ? null : "Comment can't be bigger than 191 characters")
        }
    })

    const handleProfileUpdate = async (): Promise<void> =>
    {
        let data: UserReqBody = {
            name: profileFormData.values.name,
            comment: profileFormData.values.comment,
            userId: session?.user?.id as string,
        }

        await axios.put(`${window.origin}${EndPoints.USER}`, data).then(res =>
        {
            let data: UserResBody = res.data;
            if (data.success)
            {
                router.replace(`/profile/${data.name}`)
                showNotification({
                    message: "Profile successfully changed",
                    icon: <IconCheck />,
                    color: "green",
                })
                setEditProfile(false)
            }
            else
            {
                showNotification({
                    message: "Something went wrong when saveing(User)",
                    icon: <IconX />,
                    color: "red",
                })
            }
        }).catch(error =>
        {
            console.log(error)
            showNotification({
                message: "Something went wrong when saveing,(Server)",
                icon: <IconX />,
                color: "red",
            })
        })

    }
    return (
        <Modal title="Profile settings" opened={editProfile} onClose={() => { setEditProfile(false); profileFormData.reset() }}>
            <form onSubmit={profileFormData.onSubmit((values) => { handleProfileUpdate() })}>
                <Flex direction="column" gap={20}>
                    <Group grow>
                        <TextInput title="Email cant't be changed" withAsterisk label="Email:" readOnly defaultValue={profileUser?.email as string} placeholder="Your email" {...profileFormData.getInputProps("email")} />
                        <TextInput defaultValue={profileUser.name as string} withAsterisk label="Username:" placeholder="Your name" {...profileFormData.getInputProps("name")} />
                    </Group>
                    <Textarea
                        defaultValue={profileUser.bio as string}
                        placeholder="Your comment"
                        label="Your comment"
                        {...profileFormData.getInputProps("comment")}
                    />
                </Flex>
                <Button type='submit' fullWidth mt="md">
                    Save
                </Button>
            </form>
        </Modal>
    )
}

export default ProfileSettignsModal