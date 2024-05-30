<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import {TrashIcon, PencilIcon,PlusIcon} from 'lucide-vue-next'

const items = [
    {
        title: 'Geo centrifuge',
        description: 'Cool measurement',
        creator: 'Andre Grijze',
        collection: 'GeoCentrifuge',
    },
    {
        title: 'Geo centrifuge',
        description: 'Cooler measurement',
        creator: 'Also Andre Grijze',
        collection: 'GeoCentrifuge',
    },
    {
        title: 'Geo centrifuge',
        description: 'Bad measurement',
        creator: 'Patrick',
        collection: 'GeoCentrifuge',
    },
    {
        title: 'Geo centrifuge',
        description: 'Worst measurement',
        creator: 'GertJan',
        collection: 'GeoCentrifuge',
    },
]
</script>

<template>
    <Card>
        <CardHeader>Registrated data</CardHeader>
        <CardContent>
        <Table>
            <TableCaption>List of data sets registrations, which you are allowed to edit</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-[100px]">
                        Title
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead class="text-right">
                        Collection
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="item in items" :key="item.title">
                    <TableCell class="font-medium">
                        {{ item.title }}
                    </TableCell>
                    <TableCell>{{ item.description }}</TableCell>
                    <TableCell>{{ item.creator }}</TableCell>
                    <TableCell class="text-right">
                        {{ item.collection }}
                    </TableCell>
                    <TableCell class="text-right">
                        <Button>
                            <PencilIcon class="w-4 h-4 mr-2"/>
                        </Button>
                    </TableCell>
                    <TableCell class="text-right">
                        <Button>
                            <TrashIcon class="w-4 h-4 mr-2"/>
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
            <CardFooter>
                <Button  @click="navigateTo('/register')" >
                    <PlusIcon class="w-4 h-4 mr-2" /> Register new dataset
                </Button>
            </CardFooter>
        </CardContent>
    </Card>
</template>