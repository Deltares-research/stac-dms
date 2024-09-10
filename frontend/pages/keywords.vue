<template>
  <div class="py-8 container mx-auto grid grid-cols-4 gap-12">
    <div class="flex flex-col gap-1.5 bg-gray-100 p-1.5 rounded h-fit">
      <NuxtLink
        to="/keywords/facilities"
        active-class="bg-white shadow-sm "
        class="rounded px-3 py-1.5 text-sm font-medium"
      >
        Facilities
      </NuxtLink>
      <NuxtLink
        to="/keywords/groups"
        active-class="bg-white shadow-sm "
        class="rounded px-3 py-1.5 text-sm font-medium"
        >Keyword groups</NuxtLink
      >
    </div>
    <div class="col-span-3">
      <NuxtPage />
    </div>
  </div>
</template>
