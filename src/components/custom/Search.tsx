import { Group, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import React, { FunctionComponent } from 'react'

type SearchProps = {

    getSearchData: () => void;
}

const Search: FunctionComponent<SearchProps> = (props) =>
{
    const { getSearchData } = props

    return (
        <>
            <Group my={10}>
                <TextInput radius="md" icon={<IconSearch />} placeholder='Search' />
            </Group>
        </>
    )
}

export default Search
