import { Group, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useState, useEffect } from 'react'

type SearchProps = {

    getSearchData: () => void;
}

//Add debounce
const Search: FunctionComponent<SearchProps> = (props) =>
{
    const { getSearchData } = props
    const [value, setValue] = useDebouncedState<string | undefined>(undefined, 300);
    const router = useRouter();

    useEffect(() =>
    {
        if (value !== undefined)
        {
            router.query.search = value;
            router.push({
                query: { ...router.query, search: value }
            }, undefined, { shallow: true })
            getSearchData();

        }

    }, [value])

    return (
        <>
            <Group my={10} mr={10}>
                <TextInput onChange={(e) => { setValue(e.target.value) }} radius="md" icon={<IconSearch />} placeholder='Search' />
            </Group>
        </>
    )
}

export default Search
