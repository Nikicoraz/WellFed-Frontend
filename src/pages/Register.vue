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
    import { GoogleLogin } from "vue3-google-login";
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
    const image = ref<HTMLInputElement | null>(null);
    const clientForm = ref<HTMLDivElement | null>(null);
    const merchantForm = ref<HTMLDivElement | null>(null);

    function validateInputs(form: HTMLDivElement): boolean {
        for(const child of form.children) {
            if (child.classList.contains("input") || child.classList.contains("file-input")) {
                if(!(child as HTMLInputElement).reportValidity()) {
                    return false;
                }
            }
        }

        return true;
    }

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
        if(!validateInputs(clientForm.value!)) {
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

    function registerMerchant(){
        if(!validateInputs(merchantForm.value!)) {
            return;
        }

        if(!image.value || !image.value.files) {
            triggerErrorAlert(t("alerts.noimage"));
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
            triggerErrorAlert(errorMessage);

        }).catch((e) => {
            console.error(e);
            triggerErrorAlert(t("alerts.erroreAccount"));
        });
    }

    function googleClientRegister(response: any) {
        const token: string = response.credential;
        // TODO: cambia url
        fetch(import.meta.env.VITE_BACKEND_URL + "/register/client/SSO", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        }).then(e => {
            let errorMessage = "";
            switch (e.status) {
                case 400:
                    errorMessage = t("alerts.datiNonValidi")
                    break;
                case 401:
                    errorMessage = t("alerts.googleTokenInvalido");
                    break;
                case 409:
                    errorMessage = t("alerts.emailInUsoSSO");
                    break;
                case 422:
                    errorMessage = t("alerts.emailInUsoLocale");
                    break;
                case 201:
                    alert(t("register.creato"));
                    router.push("/login");
                    break;
            }
            triggerErrorAlert(errorMessage);
        })
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
            <div ref="clientForm" v-if="isClient" class="flex flex-col gap-2" @keypress.enter.native="registerClient">
                <input class="input validator" type="text" required placeholder="Username" v-model="username" />
                <input class="input validator" type="email" required placeholder="Email" v-model="email" />
                <input class="input validator" type="password" required placeholder="Password" v-model="password" pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-_]).{8,40}$" :title="$t('register.formatoPassword')" />
                <input required type="submit" :value="$t('login.registrati')" @click="registerClient" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
                <GoogleLogin :callback="googleClientRegister" :button-config="{text: 'signup_with'}" />
            </div>
    
            <!-- The merchant registration form -->
            <div ref="merchantForm" v-else class="flex flex-col gap-2" @keypress.enter.native="registerMerchant">
                <input required type="text" class="input validator" :placeholder="$t('register.nomeNegozio')" v-model="username">
                <input required type="text" class="input validator" :placeholder="$t('register.indirizzoNegozio')" v-model="indirizzo">
                <input required type="text" class="input validator" placeholder="Partita IVA" v-model="partitaIVA">
                <input required type="email" class="input validator" placeholder="Email" v-model="email">
                <input required type="password" class="input validator" placeholder="Password" v-model="password">
                <input required type="file" ref="image" class="file-input">
                <input required type="submit" :value="$t('login.registrati')" @click="registerMerchant" class="p-4 border border-black bg-lime-900 text-white rounded-lg hover:bg-lime-950">
            </div>
        </div>
        <Alert ref="alertRef"/>
    </div>
</template>