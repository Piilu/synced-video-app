import { User } from '@prisma/client'
import React, { FunctionComponent } from 'react'

type NavDefaultItemProps = {
    user: User | undefined
}
const NavDefaultItem: FunctionComponent<NavDefaultItemProps> = (props) => {
    const { user } = props
    return (
        <div className='border'>{user?.email}</div>
    )
}

export default NavDefaultItem