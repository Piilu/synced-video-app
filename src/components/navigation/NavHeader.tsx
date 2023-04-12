import { Autocomplete, Text, Avatar, Burger, Flex, Group, Header, MantineColor, MediaQuery, Select, SelectItemProps, TextInput } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks';
import { IconUser, IconUsers } from '@tabler/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Dispatch, forwardRef, FunctionComponent, SetStateAction, useEffect, useState } from 'react'
import { EndPoints } from '../../constants/GlobalEnums';
import { UserSmall } from '../../constants/schema';
import { SearchReqBody, SearchResBody } from '../../pages/api/users/search';
import ToggleTheme from '../custom/ToggleTheme';
import { SelectItem } from '../profile/CreateRoomModal';

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
  const [data, setData] = useState<UserSmall[]>([]);
  const [value, setValue] = useDebouncedState<string | undefined>("", 300);
  const [searchText, setSearchText] = useState<string>("")
  const router = useRouter();

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
    <Header height={{ base: 50, md: 70 }} p="md">
      <Flex align="center" h="100%" justify="space-between">
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
        <Autocomplete
          icon={<IconUsers size={18} />}
          ml="auto"
          mr={10}
          w={300}
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
      </Flex>
    </Header >
  )
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, email, image, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} radius={"xl"} />

        <div>
          <Text>{value}</Text>
          <Text size="xs" color="dimmed">
            {email}
          </Text>
        </div>
      </Group>
    </div>
  )
);
export default NavHeader


