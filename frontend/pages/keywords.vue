<template>
  <div class="py-8 container mx-auto">
    <h1>Keywords management</h1>
    <div class="mt-5 mx-auto grid grid-cols-4 gap-12">
      <Lister>
        <ListerItem to="/keywords/facilities">Facilities</ListerItem>
        <ListerItem to="/keywords/groups">Keyword groups</ListerItem>
      </Lister>
      <div class="col-span-3">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
