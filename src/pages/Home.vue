<script setup lang="ts">
    import cookies from 'vue-cookies';
    import { router } from '../extensions/router';
    import MainLayout from '../layouts/MainLayout.vue';

    const token = (cookies as any).get("token");
    if(!token) {
        router.push("/login");
    }
    
    // Redirect del mercante alla sua pagina
    const merchantID = (cookies as any).get("merchantID"); 
    if(merchantID) {
        router.push("/shop/" + merchantID);
    }
</script>

<template>
    <div class="bg-fed-bg min-h-screen">
        <MainLayout />
    </div>
</template>