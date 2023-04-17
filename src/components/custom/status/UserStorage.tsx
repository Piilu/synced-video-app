import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { EndPoints } from '../../../constants/GlobalEnums'
import { UserResBody } from '../../../pages/api/profile/user'
import { getUserStorage } from '../../../utils/helpers/get-storage'
import { useRouter } from 'next/router'
import { Tooltip, Progress, Group, Text, Paper, createStyles } from '@mantine/core'
import prettyBytes from 'pretty-bytes'

const useStyles = createStyles((theme) => ({
    navWidgetBack: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3],
        borderRadius: "1.1em",
    }
}));

const UserStorage = () =>
{
    const [usedStorage, setUsedStorage] = useState<number | null | undefined>()
    const router = useRouter();
    const MAXGB = 5000000000 //5GB
    const { classes } = useStyles();
    useEffect(() => { changeStorage() }, [router])

    const changeStorage = async () =>
    {
        setUsedStorage(await getUserStorage() ?? 0);
    }

    return (
        <Tooltip label={`${usedStorage != null ? Math.floor((usedStorage * 100) / MAXGB) : 0}%`} position='right' withArrow>
            <Paper className={classes.navWidgetBack} p={10} pt={15} mt={10}>
                <Progress color="cyan" radius="xl" size="xs" value={usedStorage != null ? (usedStorage * 100) / MAXGB : 0} />
                <Group position='apart'>
                    <Text size="xs">0GB</Text>
                    <Text component='small' size="xs">{prettyBytes(usedStorage != null ? usedStorage : 0)}</Text>
                    <Text size="xs">5GB</Text>
                </Group>
            </Paper>
        </Tooltip>
    )
}

export default UserStorage
