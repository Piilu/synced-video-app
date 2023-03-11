import { Card, Text } from '@mantine/core'
import React, { FunctionComponent } from 'react'

type SmallStatsCardProps = {
    label: string,
    value: number | undefined,
}
const SmallStatsCard: FunctionComponent<SmallStatsCardProps> = (props) =>
{
    const { label, value } = props
    return (
        <Card radius="md" py={0} my="auto">
            <div>
                <Text ta="center" fz="lg" fw={500}>
                    {value != undefined ? value : "-"}
                </Text>
                <Text ta="center" fz="sm" c="dimmed">
                    {label}
                </Text>
            </div>
        </Card>
    )
}

export default SmallStatsCard
