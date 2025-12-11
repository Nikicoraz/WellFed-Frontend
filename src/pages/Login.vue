<script setup lang="ts">
    import VueCookies from "vue-cookies";
    import { router } from "../extensions/router";
    import WellfedLogoVue from "../components/WellfedLogo.vue";
    import { ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { GoogleLogin } from "vue3-google-login";
    import Alert from "../components/Alert.vue";
    import AlertType from "../types/alert";


    const {t} = useI18n();

    const email = ref("");
    const password = ref("");
    const alertRef = ref<any>(null);
    
    function triggerErrorAlert(msg: string) {
        alertRef.value.showError(AlertType.Error, msg);
    }

    function login(){
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
                triggerErrorAlert(t("alerts.autenticazioneFallita"))
                return;
            }
            const data = await e.json();
            (VueCookies as any).set("token", data.token, 86400);
            router.push(e.headers.get("Location") ?? "/");
        }).catch(e => {
            console.log(e);
            triggerErrorAlert(t("alerts.autenticazioneFallita"))
        });
    }

    function googleLogin(response: any) {
        const token: string = response.credential;

        // TODO: Cambia URL
        fetch(import.meta.env.VITE_BACKEND_URL + "/login/SSO", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        }).then(async e => {
            let errorMessage = "";
            switch (e.status) {
                case 400:
                    errorMessage = t("alerts.datiNonValidi")
                    break;
                case 401:
                    errorMessage = t("alerts.googleTokenInvalido");
                    break;
                case 200:
                    const data = await e.json();
                    (VueCookies as any).set("token", data.token, 86400);
                    router.push(e.headers.get("Location") ?? "/");
                    break;
            }

            triggerErrorAlert(errorMessage);
        })
    }
</script>
<template>
    <div class="h-screen flex bg-[url('/sfondo.png')] bg-size-[10%]" @keypress.enter.native="login()">
        <div class="m-auto flex flex-col gap-2 max-w-sm items-center rounded-xl bg-white p-12 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <WellfedLogoVue></WellfedLogoVue>
            <p>{{ $t("login.credenziali") }}</p>
            <div class="flex flex-col gap-2">
                <input type="email" v-model="email" placeholder="Email" class="input-1">
                <input type="password" v-model="password" placeholder="Password" class="input-1">
                <input type="submit" @click="login" :value="$t('login.accedi')" class="btn-1">
                <GoogleLogin :callback="googleLogin" :button-config="{text: 'signin'}" />
                <p class="text-center"> {{ $t("login.oppure") }} </p>
                <input type="submit" @click="router.push('/register')" :value="$t('login.registrati')" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
        </div>
        <Alert ref="alertRef" />
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