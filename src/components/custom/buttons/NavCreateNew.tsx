import { IconPlus } from '@tabler/icons'
import React from 'react'
import { Group, Text, UnstyledButton } from '@mantine/core'

const NavCreateNew = () =>
{
  return (
    <UnstyledButton className='nav-btn-second-bg'>
      <Group noWrap p={10} >
        <IconPlus size={20} />
        <Text m={0} size={"sm"}>Add new</Text>
      </Group>
    </UnstyledButton>
  )
}

export default NavCreateNew
