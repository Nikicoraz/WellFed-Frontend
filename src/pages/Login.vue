<script setup lang="ts">
    import VueCookies from "vue-cookies";
    import { router } from "../extensions/router";
    import WellfedLogoVue from "../components/WellfedLogo.vue";
    import { ref, type Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();
    const email = ref("");
    const password = ref("");
    const form: Ref<HTMLDivElement | null> = ref(null);

    function login(){
        // Validazione inserimento dentro ai campi
        for(const child of form.value!.children) {
            if(child.classList.contains("input")){
                if(!(child as HTMLInputElement).reportValidity()) {
                    return;
                }
            }
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email.value,
                "password": password.value
            })
        }).then(async e => {
            if(e.status == 401) {
                alert(t("alerts.autenticazioneFallita"));
                return;
            }
            const data = await e.json();
            (VueCookies as any).set("token", data.token, 86400);
            router.push(e.headers.get("Location") ?? "/");
        }).catch(e => {
            console.log(e);
            alert(t("alerts.autenticazioneFallita"));
        });
    }
</script>
<template>
    <div class="h-screen flex bg-[url('/sfondo.png')] bg-size-[10%]" @keypress.enter.native="login()">
        <div class="m-auto flex flex-col gap-2 max-w-sm items-center rounded-xl bg-white p-12 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <WellfedLogoVue></WellfedLogoVue>
            <p>{{ $t("login.credenziali") }}</p>
            <div class="flex flex-col gap-2" ref="form">
                <input class="input validator" type="email" required placeholder="Email" v-model="email" />
                <input class="input validator" type="password" required placeholder="Password" v-model="password" />
                <input type="submit" @click="login" :value="$t('login.accedi')" class="btn-1">
                <input type="submit" value="Accedi con google" class="btn-1">
                <p class="text-center"> {{ $t("login.oppure") }} </p>
                <input type="submit" @click="router.push('/register')" :value="$t('login.registrati')" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
        </div>
    </div>
</template>

<style scoped >
    @reference "tailwindcss";
    .input-1 {
        @apply border border-black rounded-lg text-center
    }

    .btn-1 {
        @apply p-4 border border-black bg-lime-700 text-white rounded-lg hover:bg-lime-800;
    }

    
</style>