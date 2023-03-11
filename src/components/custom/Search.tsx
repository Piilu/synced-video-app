import { Group, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import React, { FunctionComponent, useState, useEffect } from 'react'

type SearchProps = {

    getSearchData: (value: string) => void;
}

//Add debounce
const Search: FunctionComponent<SearchProps> = (props) =>
{
    const { getSearchData } = props
    const [value, setValue] = useDebouncedState<string | undefined>(undefined, 500);

    useEffect(() =>
    {
        if (value !== undefined)
        {
            getSearchData(value)
        }

    }, [value])
    return (
        <>
            <Group my={10}>
                <TextInput onChange={(e) => { setValue(e.target.value) }} radius="md" icon={<IconSearch />} placeholder='Search' />
            </Group>
        </>
    )
}

export default Search
