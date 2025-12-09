<script setup lang="ts">
import { ref } from "vue";
import WellfedLogo from "../components/WellfedLogo.vue";
import { router } from "../extensions/router";
let isClient = ref(true)

const username = ref("");
const email = ref("");
const password = ref("");
const partitaIVA = ref("");
const indirizzo = ref("");
const image = ref<HTMLInputElement | null>(null)

function registerClient(){
    fetch(import.meta.env.VITE_BACKEND_URL + "/register/client", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value
        })
    }).then(e => {
        if (e.status == 400) {
            alert("Invalid data entered!");
            return;
        }

        if (e.status == 409) {
            alert("The email is already in use!");
            return;
        }

        if (e.status == 201) {
            alert("The account has been created");
            router.push("/login");
            return;
        }
    }).catch(() => {
        // TODO: error handling
    });
}

function registerCommerciante(){
    const file = image.value!.files![0];


    const formData = new FormData();
    formData.append("image", file!);
    formData.append("name", username.value);
    formData.append("partitaIVA", partitaIVA.value);
    formData.append("address", indirizzo.value);
    formData.append("password", password.value);
    formData.append("email", email.value);

    fetch(import.meta.env.VITE_BACKEND_URL + "/register/merchant", {
        method: "POST",
        body: formData
    }).then(e => {
        switch (e.status) {
            case 400:
                alert("Invalid data inserted!");
                break;
            case 403:
                alert("Partita IVA validation failed");
                break;
            case 409:
                alert("Email is already in use!");
                break;
            case 202:
                alert("Account taken into processing");
                router.push("/login");
                break;
        }
    }).catch(() => {

    });
}
</script>

<template>
    <div class="h-screen flex">
        <div class="m-auto flex flex-col gap-2 max-w-sm items-center rounded-xl bg-white p-12 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <WellfedLogo/>
            <p>{{ $t("register.informazioni") }}</p>
            <div class="flex gap-2">
                <div class="user" @click="isClient = true">
                    {{ $t("register.cliente") }}
                </div>
                <div class="user" @click="isClient = false">
                    {{ $t("register.commerciante") }}
                </div>
            </div>
    
            <!-- The client registration form -->
            <div v-if="isClient" class="flex flex-col gap-2">
                <input type="text" class="input" placeholder="Username" v-model="username">
                <input type="email" class="input" placeholder="Email" v-model="email">
                <input type="password" class="input" placeholder="Password" v-model="password">
                <input type="submit" :value="$t('login.registrati')" @click="registerClient" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
    
            <!-- The merchant registration form -->
            <div v-else class="flex flex-col gap-2">
                <input type="text" class="input" :placeholder="$t('register.nomeNegozio')" v-model="username">
                <input type="text" class="input" :placeholder="$t('register.indirizzoNegozio')" v-model="indirizzo">
                <input type="text" class="input" placeholder="Partita IVA" v-model="partitaIVA">
                <input type="email" class="input" placeholder="Email" v-model="email">
                <input type="password" class="input" placeholder="Password" v-model="password">
                <input type="file" ref="image">
                <input type="submit" :value="$t('login.registrati')" @click="registerCommerciante" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
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

    .user {
        @apply outline outline-black/5 cursor-pointer hover:outline-lime-400 transition duration-250 w-25 h-25 text-center
    }
</style>