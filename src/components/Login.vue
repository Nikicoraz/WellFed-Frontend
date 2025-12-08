<script setup lang="ts">
// import { ref } from 'vue'

// defineProps<{ msg: string }>()

// const count = ref(0)

console.log("The backend url is:" + import.meta.env.VITE_BACKEND_URL);

</script>
<template>
    <div class="mx-auto flex flex-col gap-2 max-w-sm items-center rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <img src="../assets/wellfed_basket.png" alt="Logo" class="max-h-40">
        <p>Accedi con credenziali</p>
        <div class="flex flex-col gap-2">
            <input type="text" placeholder="Email" class="input">
            <input type="password" placeholder="Password" class="input">
            <input type="submit" value="Accedi" class="btn-1">
            <input type="submit" value="Accedi con google" class="btn-1">
            <p class="text-center">Oppure</p>
            <input type="submit" value="Registrati" class="p-4 border border-black bg-lime-900 text-white rounded-3xl">
        </div>
    </div>
</template>

<style scoped >
    @reference "tailwindcss";
    .input {
        @apply border border-black rounded-lg text-center
    }

    .btn-1 {
        @apply p-4 border border-black bg-lime-700 text-white rounded-lg hover:bg-lime-800;
    }
</style>