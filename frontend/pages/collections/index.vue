<template>
    <Card>
        <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>List of data sets collections, which you are allowed to edit</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="flex justify-end">
                <Button>
                    <NuxtLink to="/collections/create">Add collection</NuxtLink>
                </Button>
            </div>
            <DataTable :columns="collectionColumns" :data="data"/>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import DataTable from "@/components/table/DataTable.vue";
import type {Collection} from "@/lib/collection";
import {ArrowUpDown, Pencil, Trash2} from "lucide-vue-next";
import {Button} from '@/components/ui/button'
import type {ColumnDef} from "@tanstack/vue-table";

const data = ref<Collection[]>([])
const {$api} = useNuxtApp()
const router = useRouter()

onMounted(async () => {
  await updateUi()
})

function update(waitTime) {
    return new Promise(resolve => setTimeout(resolve, waitTime));
}
async function updateUi() {
    await new Promise(r => setTimeout(r, 1000));
    const res = await $api("/collections")
    data.value = res.collections
}
async function updateCollection(id: string) {
    router.push("/collections/update/"+id)
}

async function deleteCollection(id: string) {
    router.push("/collections/delete/"+id)
}

const collectionColumns: ColumnDef<Collection>[] = [
    {
        accessorKey: 'title',
        header: ({column}) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Title', h(ArrowUpDown, {class: 'ml-2 h-4 w-4'})])
        },
        cell: ({row}) => h('div', {class: 'lowercase'}, row.getValue('title')),
    },
    {
        accessorKey: 'description',
        header: ({column}) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Description', h(ArrowUpDown, {class: 'ml-2 h-4 w-4'})])
        },
        cell: ({row}) => {
            return h('div', {class: 'lowercase'}, row.getValue('description'))
        },
    },
    {
        id: 'edit',
        cell: ({row}) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => {
                    updateCollection(row.original.id)
                },
            }, () => ['Edit', h(Pencil, {class: 'ml-2 h-4 w-4'})])
        },
    },
    {
        id: 'delete',
        cell: ({row}) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => {
                    deleteCollection(row.original.id)
                },
            }, () => ['Delete', h(Trash2, {class: 'ml-2 h-4 w-4'})])
        },
    },
]


</script>

<style scoped>

</style>