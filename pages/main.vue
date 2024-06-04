<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      Data management suite
    </h3>
    <p class="text-sm text-muted-foreground">
      Welcome to the Deltares data management suite. Entry point for finding and
      publishing datasets.
    </p>
    <div class="grid grid-cols-3 gap-4 pt-8">
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle>Find data</CardTitle>
          <CardDescription
            >Explore the central data catalog using the radiantearth STAC
            Browser.</CardDescription
          >
        </CardHeader>
        <CardFooter class="mt-auto">
          <Button>Search data</Button>
        </CardFooter>
      </Card>
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle>Register data</CardTitle>
          <CardDescription
            >Register data for projects, experimental
            facilities</CardDescription
          >
        </CardHeader>
        <CardFooter class="mt-auto">
          <Button>Register data</Button>
        </CardFooter>
      </Card>
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription
            >Adminstration of catalogues, collections and user
            permissions</CardDescription
          >
        </CardHeader>
        <CardFooter class="mt-auto">
          <Button>Admin</Button>
        </CardFooter>
      </Card>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from "~/components/deltares/Container.vue"
</script>

<style scoped></style>
