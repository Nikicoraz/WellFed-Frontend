<script setup lang="ts">
    import PrizeCard from "./PrizeCard.vue";
    import PrizeDetailsModal from "./PrizeDetailsModal.vue";
    import { onMounted, ref, type Ref } from "vue";
    import VueCookies from "vue-cookies";
    import Alert from "../util/Alert.vue";
    import AlertType from "../../types/alert";
    import QRPopup from "../QRPopup.vue";
    import { useI18n } from "vue-i18n";
    import type Client from "../../types/client";

    const cookies = (VueCookies as any);
    const points = ref(0);
    const {t} = useI18n();

    const props = defineProps({
        shopId: String
    });

    const prizes: Ref<any[], any[]> = ref([]);
    const alert = ref<typeof Alert | null>(null);
    const displayedQRCode = ref("");
    const showPrizeDetails = ref(false);
    const prizeDetails = ref(null);

    // da mettere l'interfaccia
    function showDetails(product: any) {
        prizeDetails.value = product;
        showPrizeDetails.value = true;
    }

    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    function generateQr(id: String) {
        fetch(backendAPI + "/QRCodes/redeemPrize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + cookies.get("token")
            },
            body: JSON.stringify({
                prizeID: id
            })
        }).then(res => {
            switch(res.status) {
                case 200:
                    res.text().then((text) => {
                        displayedQRCode.value = text;
                    });
                    break;
                case 400:
                    alert.value!.showAlert(AlertType.Error, t("alerts.datiNonValidi"));
                    break;
                case 401:
                    alert.value!.showAlert(AlertType.Error, t("alerts.nonAutorizzato"));
                    break;
                case 402:
                    alert.value!.showAlert(AlertType.Error, t("alerts.mancanoPunti"));
                    break;
                default:
                    alert.value!.showAlert(AlertType.Error, res.status + ": " + t("alerts.errore"));
                    break;
            }
        });
    }

    onMounted(async () => {
        prizes.value = await fetch(`${backendAPI}/shops/${props.shopId}/prizes`)
            .then((res) => { return res.json() });

        const client = await fetch(`${backendAPI}/client`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + cookies.get("token")
            }
        });

        const clientData: Client = await client.json();
        points.value = clientData.points[props.shopId ?? ""] ?? 0;
    }
    );
</script>

<template>
    <div v-if="prizes.length > 0" class="mx-auto">
        <div class="flex align-middle gap-4">
            <h1 class="text-3xl font-bold my-8">{{ $t('shop.premi') }}</h1>
            <div class="bg-lime-700 text-white rounded-lg p-1 inline text-lg text-center my-auto">{{ $t('shop.punti') + ` ${points}` }}</div>
        </div>
        <div class="grid grid-cols-4 gap-4">
            <PrizeCard v-for="prize in prizes"
                :prize="prize"
                :editable="false"
                @show-details="showDetails"
            />
        </div> 
    </div>
    <PrizeDetailsModal 
        :open="showPrizeDetails" 
        :prizeDetails="prizeDetails" 
        @close="showPrizeDetails = false"
        :client="true"
        @generate-qr="(id) => {
            generateQr(id);
        }"
    />
    <Alert ref="alert"/>
    <QRPopup :qrcode="displayedQRCode" />
</template>