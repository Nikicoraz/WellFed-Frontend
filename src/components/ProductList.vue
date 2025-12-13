<script setup lang="ts">
    import ProductCard from "../components/ProductCard.vue";
    import ProductDetails from "../components/ProductDetails.vue";
    import { ref, onMounted, nextTick } from "vue";
    import type { Ref } from "vue";
    import EmptyAddCard from "./EmptyAddCard.vue";
    import ProductEdit from "./ProductEdit.vue";
    import ProductSelector from "./ProductSelector.vue";
    import Alert from "./Alert.vue";
    import AlertType from "../types/alert";
    import { useI18n } from "vue-i18n";
    import cookies from "vue-cookies";
    import QRPopup from "./QRPopup.vue";
    
    const {t} = useI18n();


    const props = defineProps({
        shopId: String,
        editable: Boolean,
        creatingTransaction: Boolean
    });

    // useRoute prende il parametro :shopId definito nella route
    const products: Ref<any[], any[]> = ref([]);
    const shopFound = ref(true);
    const detailsProductId = ref("");
    const modalRef: Ref<any> = ref(null);
    const selectors = ref<typeof ProductSelector[] | null>(null);
    const alertRef = ref<typeof Alert | null>(null);
    const displayQRCode = ref("");

    async function showDetails(productId: string) {
        detailsProductId.value = productId;
        await nextTick();
        modalRef.value?.open();
    }

    async function newElementDetails() {
        detailsProductId.value = "";
        await nextTick();
        modalRef.value?.open();
    }

    async function updateProducts() {
        products.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products`)
            .then((res) => { return res.json() })
            .catch(() => { shopFound.value = false });
    }

    function createTransactionQR() {
        const toAdd = [];
        for(const selector of selectors.value!) {
            if(selector.getCount() > 0){
                toAdd.push({
                    productID: selector.getProductId(),
                    quantity: selector.getCount()
                });
            }
        }

        if(toAdd.length == 0) {
            alertRef.value!.showError(AlertType.Error, t("alerts.nessunProdotto"));
            return;
        }

        const token = (cookies as any).get("token");

        fetch(import.meta.env.VITE_BACKEND_URL_API + "/QRCodes/assignPoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(toAdd)
        }).then(e => {
            switch(e.status) {
                case 200:
                    e.text().then(t => {
                        displayQRCode.value = t;
                    });
                    break;
                case 400:
                    alertRef.value!.showError(AlertType.Error, t("alerts.datiNonValidi"));
                    break;
                case 401:
                    alertRef.value!.showError(AlertType.Error, t("alerts.nonAutorizzato"));
                    break;
                default:
                    alertRef.value!.showError(AlertType.Error, e.status + ": " + t("alerts.errore"));
                    break;
            }
        })
    }

    onMounted(() => {
        updateProducts();
    });

    defineExpose({createTransactionQR});
</script>

<template>
    <div v-if="shopFound" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">{{ $t('shop.prodotti') }}</h1>
        <div class="grid grid-cols-4 gap-4">
            <!-- Pulsante per l'aggiunta di un nuovo prodotto -->
            <EmptyAddCard v-if="editable" @click="newElementDetails" />
            <!-- Prodotti  del negozio -->
            <div v-for="product in products">
                <ProductCard :shopId="shopId" :key="product" :productId="product.id" :editable="editable" @showDetails="showDetails" :class="props.creatingTransaction ? 'rounded-b-none' : ''" />
                <ProductSelector ref="selectors" v-if="props.creatingTransaction" :productId="product.id" />
            </div>
        </div> 
    </div>
    <!-- Popup visualizzazione -->
    <ProductDetails ref="modalRef" :shopId="shopId" :productId="detailsProductId" v-if="!editable" />
    <!-- Popup creazione -->
    <ProductEdit ref="modalRef" :onProductAdded="updateProducts" :shopId="shopId" :productId="detailsProductId"  v-if="editable" />

    <Alert ref="alertRef" />
    <QRPopup :qrcode="displayQRCode" />
</template>