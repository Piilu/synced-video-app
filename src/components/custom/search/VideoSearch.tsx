import { Select } from '@mantine/core'
import axios from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { EndPoints } from '../../../constants/GlobalEnums'
import { RoomReq } from '../../../pages/api/rooms'
import { VideoRes } from '../../../pages/api/videos'
import { useSession } from 'next-auth/react'
import { useDebouncedState } from '@mantine/hooks'
import { VideoSmall } from '../../../constants/schema'

type VideoSearchType = {
    label: string,
    notFoundLabel: string,
    isAsterisk?: boolean,
    form: any,
}
const VideoSearch: FunctionComponent<VideoSearchType> = (props) =>
{
    const { data: session } = useSession();
    const [data, setData] = useState<VideoSmall[]>([]);
    const [value, setValue] = useDebouncedState<string | undefined>("", 300);
    const { label, notFoundLabel, isAsterisk, form } = props

    useEffect(() =>
    {
        if (value !== undefined)
        {
            searchVideos(value)
        }

    }, [value])

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
                const data2 = newData.videos !== undefined ? newData.videos.map((item) => ({ ...item, value: `${item.name} | ${item.id}`, label: item.name })) : null;
                setData(data2)
            }

        }).catch(err =>
        {
            console.log(err.message)
        })
    }

    return (
        <Select
            label={label}
            nothingFound={notFoundLabel}
            data={data}
            onSearchChange={(e) => { setValue(e) }}
            searchable
            clearable
            withAsterisk={isAsterisk}
            filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim())
            }
            {...form.getInputProps("video")}
            maxDropdownHeight={400} />
    )
}

export default VideoSearch
