<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Container from "@/components/deltares/Container";

import { TrashIcon, PencilIcon, PlusIcon } from "lucide-vue-next";

let { data: items } = await useApi("/search");
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
              <TableHead>Collection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody v-if="items">
            <TableRow v-for="feature in items.features">
              <TableCell class="font-medium">
                {{ feature.properties.title }}
              </TableCell>
              <TableCell>{{ feature.properties.description }}</TableCell>
              <TableCell>
                {{ feature.collection }}
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
