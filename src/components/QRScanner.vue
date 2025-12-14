<script setup lang="ts">
    import { nextTick, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import {QrcodeStream, type DetectedBarcode} from 'vue-qrcode-reader';
    import Alert from './Alert.vue';
    import AlertType from '../types/alert';
    import cookies from 'vue-cookies';

    const dialog = ref<HTMLDialogElement | null>(null);
    const alertRef = ref<typeof Alert | null>(null);
    const useCamera = ref(false);
    const {t} = useI18n();

    // Instanzio il componente solo quando serve, altrimenti la telecamera viene sempre utilizzata
    async function showQR(){
        useCamera.value = true;
        await nextTick();
        dialog.value?.showModal();
    }

    function detected(codes: DetectedBarcode[]){
        const code = codes[0];
        console.log(code?.rawValue);
        dialog.value?.close();
        useCamera.value = false;

        console.log(JSON.stringify({token: code?.rawValue}));

        fetch(import.meta.env.VITE_BACKEND_URL_API + "/QRCodes/scanned", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + (cookies as any).get("token")
            },
            body: JSON.stringify({
                token: code?.rawValue
            })
        }).then(e => {
            switch (e.status) {
                case 200:
                    alertRef.value!.showError(AlertType.Success, t("shop.transazioni.successo"));
                    break;
                case 400:
                    alertRef.value!.showError(AlertType.Error, t("shop.qrcode.invalido"));
                    break;
                case 401:
                    alertRef.value!.showError(AlertType.Error, t("alerts.nonAutorizzato"));
                    break;
            }
        })
    }
</script>

<template>
    <div class="w-20 h-20 rounded-xl cursor-pointer fixed right-4 bottom-4" @click="showQR">
        <img src="../assets/scanner.svg" alt="">
    </div>
    <dialog class="modal" ref="dialog" v-if="useCamera" @close="useCamera = false">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Scannerizza il QR code generato dal commerciante!</h3>
            <QrcodeStream @detect="detected" />
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
    <Alert ref="alertRef" />
</template>