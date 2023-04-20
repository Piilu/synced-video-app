import { IconPlus } from '@tabler/icons'
import React, { FunctionComponent, useState } from 'react'
import { Drawer, Group, Modal, Text, UnstyledButton } from '@mantine/core'

type NavCreateNewProps = {
  onClick: () => void,
}

const NavCreateNew: FunctionComponent<NavCreateNewProps> = (props) =>
{
  const { onClick } = props;

  return (
    <>
      <UnstyledButton onClick={onClick} className='nav-btn-second-bg'>
        <Group noWrap p={10} >
          <IconPlus size={20} />
          <Text m={0} size={"sm"}>Add new</Text>
        </Group>
      </UnstyledButton>
    </>
  )
}

export default NavCreateNew
