<template>
  <div class="py-8 container mx-auto">
    <h1 class="font-semibold text-3xl border-b pb-3">Keywords management</h1>
    <div class="mt-8 mx-auto grid grid-cols-4 gap-12">
      <div>
        <div
          class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"
        >
          Section
        </div>
        <Lister class="mt-3">
          <ListerItem to="/keywords/facilities">Facilities</ListerItem>
          <ListerItem to="/keywords/groups">Keyword groups</ListerItem>
        </Lister>
      </div>

      <div class="col-span-3">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
