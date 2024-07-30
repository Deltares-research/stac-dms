<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      Admin
    </h3>
    <p class="text-sm text-muted-foreground">
      Administration of catalogues, collections and permissions.
    </p>
    <div class="grid grid-cols-3 gap-4 pt-8">
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle>Catalogue</CardTitle>
          <CardDescription>Administration of catalogues</CardDescription>
        </CardHeader>
        <CardFooter class="mt-auto">
          <Button>Admin catalogue</Button>
        </CardFooter>
      </Card>
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>Administration of collections</CardDescription>
        </CardHeader>
        <CardFooter class="mt-auto">
          <Button as-child>
            <NuxtLink to="/collections">Collections</NuxtLink>
          </Button>
        </CardFooter>
      </Card>
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Administration of user permissions</CardDescription>
        </CardHeader>
        <CardFooter class="mt-auto">
          <Button>Admin permissions</Button>
        </CardFooter>
      </Card>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from "~/components/deltares/Container.vue"
</script>

<style scoped></style>
