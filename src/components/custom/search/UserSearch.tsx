import { Autocomplete, Avatar, Group, Text, SelectItemProps, Box, } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconUsers } from '@tabler/icons';
import router from 'next/router';
import React, { forwardRef, useEffect, useState } from 'react'
import { UserSmall } from '../../../constants/schema';
import axios from 'axios';
import { EndPoints } from '../../../constants/GlobalEnums';
import { SearchReqBody, SearchResBody } from '../../../pages/api/users/search';

const UserSearch = () =>
{
    const [data, setData] = useState<UserSmall[]>([]);
    const [value, setValue] = useDebouncedState<string | undefined>("", 300);
    const [searchText, setSearchText] = useState<string>("")

    useEffect(() =>
    {
        if (value !== undefined)
        {
            searchUsers(value)
        }

    }, [value])

    const searchUsers = async (name: string) =>
    {
        const data: SearchReqBody = {
            getName: name,
        }
        await axios.get(`${window.origin}${EndPoints.USER_SEARCH}`, { params: data }).then(res =>
        {
            const newData = res.data as SearchResBody;

            if (newData.success)
            {
                const data2 = newData.users !== undefined ? newData.users.map((item) => ({ ...item, value: item.name })) : null;
                setData(data2)
            }
            else
            {
                console.log("Failed")
            }
        }).catch(err =>
        {
            console.error(err.message)
        })
    }
    return (
        <Autocomplete
            variant="unstyled"
            icon={<IconUsers size={18} />}
            w="100%"
            value={searchText}
            placeholder="Search ..."
            itemComponent={AutoCompleteItem}
            nothingFound={`User '${value ?? "-"}' doesn't exist`}
            onChange={(e) => { setValue(e); setSearchText(e) }}
            onItemSubmit={(e) =>
            {
                router.push({
                    pathname: "/profile/{0}".replace("{0}", e.value),
                }, undefined);
            }}
            data={data}
            filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim())
            }
        />
    )
}


interface ItemProps extends SelectItemProps
{
    image: string;
    name: string;
    email: string;
}
const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ value, email, image, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar size={"md"} src={image} radius={"xl"} />
                <div>
                    <Text>{value}</Text>
                    <Text component='small' size="xs" color="dimmed">
                        {email}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

export default UserSearch
