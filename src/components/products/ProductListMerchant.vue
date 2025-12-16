<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import type { Ref } from "vue";
    import EmptyAddCard from "./EmptyAddCard.vue";
    import ProductEditModal from "./ProductEditModal.vue";
    import ProductSelector from "./ProductSelector.vue";
    import ProductCard from "./ProductCardClient.vue";
    import ProductDetailsModal from "./ProductDetailsModal.vue";
    import ProductInsertModal from "./ProductInsertModal.vue";
    import { useI18n } from "vue-i18n";
    import QRPopup from "../QRPopup.vue";
    import VueCookies from "vue-cookies";
    import Alert from "../util/Alert.vue";
    import AlertType from "../../types/alert";

    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const cookies = (VueCookies as any);

    const props = defineProps({
        shopId: String,
        isCreatingTransaction: Boolean
    });

    // useRoute prende il parametro :shopId definito nella route
    const shopFound = ref(true);

    const products: Ref<any[], any[]> = ref([]);

    // Riferimenti per alert e selettori
    const alert = ref<typeof Alert | null>(null);
    const selectors = ref<typeof ProductSelector[] | null>(null);
    const displayedQRCode = ref("");

    // Dettagli
    const showProductDetails = ref(false);
    const productDetails = ref(null);

    // Inserimento
    const showInsertNewProduct = ref(false);

    // Modifica
    const showEditProduct = ref(false);
    const editedProductId = ref("");

    function showDetails(product: any) {
        productDetails.value = product;
        showProductDetails.value = true;
    }

    async function refreshProducts() {
        products.value = await fetch(`${backendAPI}/shops/${props.shopId}/products`)
            .then((res) => { return res.json() })
            .catch(() => { shopFound.value = false });
    }

    function generateQR() {
        const toAdd = [];

        if (!selectors.value) {
            return;
        }

        for (const selector of selectors.value) {
            if (selector.getCount() > 0){
                toAdd.push({
                    productID: selector.getProductId(),
                    quantity: selector.getCount()
                });
            }
        }

        if(toAdd.length == 0) {
            alert.value!.showAlert(AlertType.Error, t("alerts.nessunProdotto"));
            return;
        }

        const token = cookies.get("token");

        fetch(`${backendAPI}/QRCodes/assignPoints`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(toAdd)
        }).then((res) => {
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
                default:
                    alert.value!.showAlert(AlertType.Error, res.status + ": " + t("alerts.errore"));
                    break;
            }
        })
    }

    const isCreatingTransaction = ref(false);
    function startTransaction() {
        isCreatingTransaction.value = true;
    }

    defineExpose({generateQR, startTransaction});

    onMounted(async () => {
        await refreshProducts();
    });
</script>

<template>
    <div v-if="shopFound" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">{{ $t('shop.prodotti') }}</h1>
        <div class="grid grid-cols-4 gap-4">
            <!-- Pulsante per l'aggiunta di un nuovo prodotto -->
            <EmptyAddCard @click="() => { showInsertNewProduct = true; }" />
            <!-- Prodotti  del negozio -->
            <div v-for="product in products" :key="product.id">
                <ProductCard 
                    :product="product" 
                    :editable="true"
                    @showDetails="showDetails"
                    @edit="(productId) => { 
                        editedProductId = productId; 
                        showEditProduct = true;
                    }"
                />
                <ProductSelector ref="selectors" v-if="props.isCreatingTransaction" class="my-2" :productId="product.id" />
            </div>
        </div> 
    </div>
    <ProductDetailsModal 
        :open="showProductDetails" 
        :productDetails="productDetails" 
        @close="showProductDetails = false"
    />
    <ProductInsertModal
        :shopId="shopId" 
        :open="showInsertNewProduct"
        @close="showInsertNewProduct = false"
        @product-saved="refreshProducts"
    />
    <ProductEditModal 
        :shopId="shopId" 
        :productId="editedProductId"
        :open="showEditProduct"
        @close="showEditProduct = false"
        @product-saved="refreshProducts"
    />
    <Alert ref="alert"/>
    <QRPopup :qrcode="displayedQRCode"/>
</template>