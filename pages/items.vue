<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Container from "@/components/deltares/Container"

import { TrashIcon, PencilIcon, PlusIcon } from "lucide-vue-next"

const items = [
  {
    title: "Geo centrifuge",
    description: "Cool measurement",
    creator: "Andre Grijze",
    collection: "GeoCentrifuge",
  },
  {
    title: "Geo centrifuge",
    description: "Cooler measurement",
    creator: "Also Andre Grijze",
    collection: "GeoCentrifuge",
  },
  {
    title: "Geo centrifuge",
    description: "Bad measurement",
    creator: "Patrick",
    collection: "GeoCentrifuge",
  },
  {
    title: "Geo centrifuge",
    description: "Worst measurement",
    creator: "GertJan",
    collection: "GeoCentrifuge",
  },
]
</script>

<template>
  <Container class="py-8">
    <div class="flex items-center justify-between gap-5">
      <h1 class="font-semibold text-2xl">Registered data</h1>
      <Button as-child>
        <NuxtLink to="/register" class="flex items-center gap-1">
          <PlusIcon class="w-4 h-4 mr-2" /> Register new dataset
        </NuxtLink>
      </Button>
    </div>
    <Card class="mt-8">
      <CardContent class="p-0 pb-5">
        <Table>
          <TableCaption
            >List of data sets registrations, which you are allowed to
            edit</TableCaption
          >
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Collection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in items" :key="item.title">
              <TableCell class="font-medium">
                {{ item.title }}
              </TableCell>
              <TableCell>{{ item.description }}</TableCell>
              <TableCell>{{ item.creator }}</TableCell>
              <TableCell>
                {{ item.collection }}
              </TableCell>
              <TableCell>
                <div class="flex gap-1.5 justify-end">
                  <Button size="icon" variant="outline">
                    <PencilIcon class="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive">
                    <TrashIcon class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </Container>
</template>
