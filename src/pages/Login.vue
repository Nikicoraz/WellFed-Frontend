<script setup lang="ts">
    import  VueCookies from "vue-cookies";
    import { router } from "../extensions/router";
    import WellfedLogoVue from "../components/util/WellfedLogo.vue";
    import { ref, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { GoogleLogin } from "vue3-google-login";
    import Alert from "../components/util/Alert.vue";
    import AlertType from "../types/alert";

    const {t} = useI18n();
    const cookies = (VueCookies as any);

    const email = ref("");
    const password = ref("");
    const form: Ref<HTMLDivElement | null> = ref(null);
    const alertRef = ref<any>(null);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    
    function triggerErrorAlert(msg: string) {
        alertRef.value.showAlert(AlertType.Error, msg);
    }

    function login(){
        // Validazione inserimento dentro ai campi
        for (const child of form.value!.children) {
            if (child.classList.contains("input")){
                if (!(child as HTMLInputElement).reportValidity()) {
                    return;
                }
            }
        }

        // Dopo 1 minuto e 30 secondi considero l'autenticazione fallita e quindi tolgo il messaggio
        alertRef.value.showAlertWithDuration(AlertType.Info, t("alerts.waitLogin"), 90 * 1000);
        
        fetch(import.meta.env.VITE_BACKEND_URL_API + "/login", {
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
            cookies.set("token", data.token, "1d");

            // TODO: scrivere meglio, al massimo migliorare le api
            const redirectURL = e.headers.get("Location") ?? "/login";

            if (redirectURL.includes("/shop/")) {
                cookies.set("merchantID", redirectURL.split("/shop/")[1], "1d");
            } else {
                cookies.remove("merchantID");
            }

            router.push(redirectURL);

        }).catch(e => {
            console.log(e);
            triggerErrorAlert(t("alerts.autenticazioneFallita"))
        });
    }

    function googleLogin(response: any) {
        const token: string = response.credential;

        // Dopo 1 minuto e 30 secondi considero l'autenticazione fallita e quindi tolgo il messaggio
        alertRef.value.showAlertWithDuration(AlertType.Info, t("alerts.waitLogin"), 1 * 1000);
        fetch(backendAPI.concat("/login/SSO"), {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        }).then(async e => {
            let errorMessage = "";
            const redirectURL = e.headers.get("Location") ?? "/login";

            switch (e.status) {
                case 400:
                    errorMessage = t("alerts.datiNonValidi")
                    break;
                case 401:
                    errorMessage = t("alerts.googleTokenInvalido");
                    break;
                case 200:
                    const data = await e.json();
                    cookies.set("token", data.token, "1d");
                    cookies.remove("merchantID");
                    router.push(redirectURL);
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
            <div class="flex flex-col gap-2" ref="form">
                <input class="input validator" type="email" required placeholder="Email" v-model="email" />
                <input class="input validator" type="password" required placeholder="Password" v-model="password" />
                <input type="submit" @click="login" :value="$t('login.accedi')" class="btn-1">
                <GoogleLogin :callback="googleLogin" :button-config="{text: 'signin', width: '100%' }" />
                <p class="text-center"> {{ $t("login.oppure") }} </p>
                <input type="submit" @click="router.push('/register')" :value="$t('login.registrati')" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
        </div>
        <Alert ref="alertRef" />
    </div>
</template>

<style scoped>
    @reference "tailwindcss";

    .btn-1 {
        @apply p-4 border border-black bg-lime-700 text-white rounded-lg hover:bg-lime-800;
    }
</style>