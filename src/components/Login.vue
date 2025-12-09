<script setup lang="ts">
import VueCookies from "vue-cookies";

const email: string = "";
const password: string = "";

function login(email: string, password: string){
    fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    }).then(async e => {
        const data = await e.json();
        (VueCookies as any).set("token", data.token, 86400);
        // TODO: redirect
    }).catch(e => {
        console.log(e);
        alert("Authentication failed");
    });
}
</script>
<template>
    <div class="mx-auto flex flex-col gap-2 max-w-sm items-center rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <img src="../assets/wellfed_basket.png" alt="Logo" class="max-h-40">
        <p>Accedi con credenziali</p>
        <div class="flex flex-col gap-2">
            <input type="text" v-model="email" placeholder="Email" class="input">
            <input type="password" v-model="password" placeholder="Password" class="input">
            <input type="submit" @click="login(email, password)" value="Accedi" class="btn-1">
            <input type="submit" value="Accedi con google" class="btn-1">
            <p class="text-center">Oppure</p>
            <input type="submit" value="Registrati" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
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