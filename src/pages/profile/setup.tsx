import { Alert, Button, FileInput, Flex, Group, Modal, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconCheck, IconUpload, IconX } from '@tabler/icons'
import axios from 'axios'
import file from 'fetch-blob/file'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { EndPoints } from '../../constants/GlobalEnums'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'
import { UserReqBody, UserResBody } from '../api/profile/user'

export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
    const session = await getServerAuthSession(ctx)
    if (session?.user?.name == null)
    {
        return { props: { session } }
    }
    return {
        redirect: {
            permanent: false,
            destination: `/profile/${session.user.name}`,
        }
    }
}

const setup = () =>
{
    const [loading, setLoading] = useState<boolean>(false)
    const { data: session } = useSession();
    const form = useForm({
        initialValues: {
            name: ""
        },
        validate: {

        }
    })
    useEffect(() =>
    {
        form.setValues({})
    }, [])

    const handleProfileSave = async (): Promise<void> =>
    {
        let data: UserReqBody = {
            name: form.values.name,
            comment: "",
            userId: session?.user?.id as string,
        }
        setLoading(true);
        await axios.put(`${window.origin}${EndPoints.USER}`, data).then(res =>
        {
            let newData: UserResBody = res.data;
            if (newData.success)
            {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    title: `Hey ${newData.name} :)`,
                    message: "Name added successfully",
                    icon: <IconCheck />,
                    color: "green",
                })
            }
            else
            {
                showNotification({
                    message: newData.errormsg,
                    icon: <IconX />,
                    color: "red",
                })
                return;
            }
        }).catch(error =>
        {
            console.log(error)
            showNotification({
                message: "Something went wrong when saveing,(Server)",
                icon: <IconX />,
                color: "red",
            })
            return;
        }).finally(() =>
        {
            setLoading(false)
        })
    }

    return (
        <>
            <Modal centered opened={true} withCloseButton={false} onClose={() => null}>
                <Alert title="Bummer!" mb={5} color="red">
                    Seems like you are missing a name
                </Alert>
                <form onSubmit={form.onSubmit((values) => { })}>
                    <Flex direction="column" rowGap={10} >
                        <Group grow>
                            <TextInput withAsterisk label="Username" placeholder='John' {...form.getInputProps("name")} />
                        </Group>
                    </Flex>
                    <Button loading={loading} onClick={handleProfileSave} type='submit' fullWidth mt="md">
                        Save
                    </Button>
                </form>
            </Modal>

        </>
    )
}

export default setup
