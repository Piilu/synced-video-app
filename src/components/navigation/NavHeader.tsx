import { Autocomplete, Text, Avatar, Burger, Flex, Group, Header, MantineColor, MediaQuery, Select, SelectItemProps, TextInput, Container } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks';
import { IconUser, IconUsers } from '@tabler/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Dispatch, forwardRef, FunctionComponent, SetStateAction, useEffect, useState } from 'react'
import { EndPoints } from '../../constants/GlobalEnums';
import { UserSmall } from '../../constants/schema';
import { SearchReqBody, SearchResBody } from '../../pages/api/users/search';
import ToggleTheme from '../custom/ToggleTheme';
import UserSearch from '../custom/search/UserSearch';
import UserButton from '../custom/buttons/UserButton';

interface ItemProps extends SelectItemProps
{
  image: string;
  name: string;
  email: string;
}

type NavHeaderProps = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>
}

const NavHeader: FunctionComponent<NavHeaderProps> = (props) =>
{
  const { setOpened, opened } = props;

  return (
    <Header height={{ base: 50, md: 70 }} p="md" >
      <Flex align="center" h="100%" pl={50} pr={50}>
        <Text component='h2' size={25} mr={25} >WatchParty </Text>
        <UserSearch />
        <UserButton />
      </Flex>
    </Header >
  )
}

export default NavHeader


