<script setup lang="ts">
    import { ref } from "vue";
    import type { Ref } from "vue";
    import WellfedLogo from "../components/WellfedLogo.vue";
    import { router } from "../extensions/router";
    import UserSelection from "../components/UserSelection.vue";
    import clientImage from "../assets/user.svg"
    import shopImage from "../assets/shop.svg"
    import backArrow from "../assets/back.svg";
    import { useI18n } from "vue-i18n";
    import Alert from "../components/Alert.vue";
    import AlertType from "../types/alert";

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-_]).{8,40}$/;
    const simpleEmailRegex = /.+(\..+)?@.+\..{2,3}/;
    const {t} = useI18n();
    let isClient = ref(true);

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const partitaIVA = ref("");
    const indirizzo = ref("");
    const image = ref<HTMLInputElement | null>(null)

    // Non ho idea di che tipo sia 
    const alertRef: Ref<any> = ref(null);
    function triggerErrorAlert(msg: String) {
        alertRef.value?.showError(AlertType.Error, msg);
    }

    function commonValidations(): boolean {
        if(!email.value.match(simpleEmailRegex)) {
            triggerErrorAlert(t("register.reqEmail"));
            return false;
        }

        if(!password.value.match(passwordRegex)) {
            triggerErrorAlert(t("register.reqPassword"));
            return false;
        }

        return true;
    }        

    function registerClient(){
        if(!commonValidations()) {
            return;
        }

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
            switch (e.status) {
                case 400:
                    triggerErrorAlert(t("alerts.datiNonValidi"));
                    break;
                case 409:
                    triggerErrorAlert(t("alerts.emailInUso"));
                    break;
                case 201:
                    // Lasciato un alert siccome subito dopo c'è un redirect
                    alert(t("register.creato"));
                    router.push("/login");
                    break;
            }
        }).catch((e) => {
            console.error(e);
            triggerErrorAlert(t("alerts.erroreAccount"));
        });
    }

    function registerMerchant() {
        let errorMessage: string = "";
        
        if (!image.value || !image.value.files || image.value.files.length == 0) {
            errorMessage = t("alerts.noimage");
            return;
        }

        if (!commonValidations()) {
            return;
        }

        const file = image.value.files[0];

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
                    errorMessage = t("alerts.datiNonValidi");
                    break;
                case 403:
                    errorMessage = t("alerts.partitaIVAInvalida");
                    break;
                case 409:
                    errorMessage = t("alerts.emailInUso");
                    break;
                case 202:
                    alert(t("register.processando"));
                    router.push("/login");
                    break;
            }
            triggerErrorAlert( errorMessage);

        }).catch((e) => {
            console.error(e);
            triggerErrorAlert(t("alerts.erroreAccount"));
        });
    }
</script>

<template>
    <div class="h-screen flex bg-[url('/sfondo.png')] bg-size-[10%]">
        <div class="m-auto flex flex-col gap-2 max-w-sm items-center rounded-xl bg-white p-12 shadow-lg outline outline-black/5">
            <div class="relative w-full">
                <img class="absolute -top-4 -left-4 border border-black rounded-full cursor-pointer size-8 inline-flex items-center justify-center" :src="backArrow" @click="router.push('/login')"></img>
            </div>
            <WellfedLogo/>
            <p>{{ $t("register.informazioni") }}</p>
            <div class="flex gap-4">
                <UserSelection name="register.cliente" :image="clientImage" :callback="() => {isClient = true}"></UserSelection>
                <UserSelection name="register.commerciante" :image="shopImage" :callback="() => {isClient = false}"></UserSelection>
            </div>
    
            <!-- The client registration form -->
            <div v-if="isClient" class="flex flex-col gap-2" @keypress.enter.native="registerClient">
                <input required ref="utest" type="text" class="input-1" placeholder="Username" v-model="username">
                <input required type="email" class="input-1" placeholder="Email" v-model="email">
                <input required type="password" class="input-1" placeholder="Password" v-model="password">
                <input required type="submit" :value="$t('login.registrati')" @click="registerClient" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
    
            <!-- The merchant registration form -->
            <div v-else class="flex flex-col gap-2" @keypress.enter.native="registerMerchant">
                <input required type="text" class="input-1" :placeholder="$t('register.nomeNegozio')" v-model="username">
                <input required type="text" class="input-1" :placeholder="$t('register.indirizzoNegozio')" v-model="indirizzo">
                <input required type="text" class="input-1" placeholder="Partita IVA" v-model="partitaIVA">
                <input required type="email" class="input-1" placeholder="Email" v-model="email">
                <input required type="password" class="input-1" placeholder="Password" v-model="password">
                <input required type="file" ref="image" class="file-input">
                <input required type="submit" :value="$t('login.registrati')" @click="registerMerchant" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
        </div>
        <Alert ref="alertRef"/>
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