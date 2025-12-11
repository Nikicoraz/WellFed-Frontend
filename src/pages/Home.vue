<script setup lang="ts">
    import cookies from 'vue-cookies';
import { router } from '../extensions/router';
import SearchBar from '../components/NavBar.vue';

    const token = (cookies as any).get("token");
    if(!token) {
        router.push("/login");
    }
</script>

<template>
    <SearchBar />
</template>