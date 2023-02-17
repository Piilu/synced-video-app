import { Button } from '@mantine/core'
import { IconBrandDiscord } from '@tabler/icons'
import React, { FunctionComponent } from 'react'
import { Brands } from '../../constants/events'

type BrandButtonsProps = {
    brand: string;
    onClick: ()=>void;

}
const BrandButtons: FunctionComponent<BrandButtonsProps> = (props) => {
    const { brand, onClick } = props
    if (brand == Brands.DISCORD) {
        return (
            <Button
                onClick={onClick}
                fullWidth
                leftIcon={<IconBrandDiscord />}
                styles={(theme) => ({
                    root: {
                        backgroundColor: '#7289da',
                        border: 0,
                        marginBottom: "1em",
                        '&:hover': {
                            backgroundColor: theme.fn.darken('#00acee', 0.05),
                        },
                    },
                    leftIcon: {
                        marginRight: 15,
                    },
                })}
            >
                Sign in with {brand}
            </Button>
        )
    }
    return null;

}

export default BrandButtons