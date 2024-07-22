<script setup lang="ts">

import {User} from 'lucide-vue-next'
import {Button} from '@/components/ui/button'
import {useFetch} from "nuxt/app";


const {data, error:notAuthenticated, refresh} = await useFetch("/api/auth/me")
async function logout() {
    await $fetch("/api/auth/logout");
    await refresh()
}


</script>

<template>
    <div class="grid grid-cols-2 py-2 px-4 border-b border-border">
        <nav class="flex">
            <Button as-child variant="link">
                <NuxtLink to="/">Search</NuxtLink>
            </Button>
            <Button as-child v-if="!notAuthenticated" variant="link">
                <NuxtLink to="/items">Register</NuxtLink>
            </Button>
            <Button as-child v-if="!notAuthenticated" variant="link">
                <NuxtLink to="/main">Admin</NuxtLink>
            </Button>
            <Button as-child variant="link">
                <NuxtLink to="/main">Storage Finder</NuxtLink>
            </Button>
        </nav>
        <div class="flex justify-end">
            <nav class="flex">
                <Button v-if="notAuthenticated" variant="link">
                    <a href="/api/auth/login"> Login</a>
                </Button>
                <Button v-if="!notAuthenticated" variant="ghost" @click="logout">
                    <User class="w-4 h-4 mr-2"/>
                    {{ data.display_name }} Logout
                </Button>
            </nav>
        </div>
    </div>
    <NuxtPage/>

    <Toaster/>
</template>