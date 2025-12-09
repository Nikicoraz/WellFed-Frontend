<script setup lang="ts">
    import cookies from 'vue-cookies';
import { router } from '../extensions/router';

    const token = (cookies as any).get("token");
    if(!token) {
        router.push("/login");
    }
</script>

<template>
    <h1>Ciaoo</h1>
</template>