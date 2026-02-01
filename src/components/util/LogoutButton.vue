<script setup lang="ts">
    import VueCookies from "vue-cookies";
    import { router } from '../../extensions/router';

    function logout() {
        (VueCookies as any).remove('token');
        (VueCookies as any).remove('merchantID');
        router.push("/login");
    }
</script>

<template>
    <button class="button bg-base-200 text-black p-2 rounded-2xl cursor-pointer" @click="logout">Logout</button>
</template>