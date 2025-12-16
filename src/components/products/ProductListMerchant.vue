<script setup lang="ts">
    import ProductCard from "./ProductCardClient.vue";
    import ProductDetailsModal from "./ProductDetailsModal.vue";
    import ProductInsertModal from "./ProductInsertModal.vue";
    import { ref } from "vue";
    import type { Ref } from "vue";
    import EmptyAddCard from "./EmptyAddCard.vue";
    import ProductEdit from "./ProductEdit.vue";
    import ProductSelector from "./ProductSelector.vue";
    import { useI18n } from "vue-i18n";
    import QRPopup from "../QRPopup.vue";

    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const props = defineProps({
        shopId: String,
        creatingTransaction: Boolean
    });

    // useRoute prende il parametro :shopId definito nella route
    const shopFound = ref(true);
    const detailsProductId = ref("");

    const products: Ref<any[], any[]> = ref([]);
    const showProductDetails = ref(false);
    const productDetails = ref(null);

    const showInsertNewProduct = ref(false);

    function showDetails(product: any) {
        productDetails.value = product;
        showProductDetails.value = true;
    }

    async function updateProducts() {
        products.value = await fetch(`${backendAPI}/shops/${props.shopId}/products`)
            .then((res) => { return res.json() })
            .catch(() => { shopFound.value = false });
    }

    await updateProducts();
</script>

<template>
    <div v-if="shopFound" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">{{ $t('shop.prodotti') }}</h1>
        <div class="grid grid-cols-4 gap-4">
            <!-- Pulsante per l'aggiunta di un nuovo prodotto -->
            <EmptyAddCard @click="showInsertNewProduct = true" />
            <!-- Prodotti  del negozio -->
            <div v-for="product in products">
                <ProductCard 
                    :shopId="shopId" 
                    :productId="product.id" 
                    :editable="true"
                    @showDetails="showDetails"
                />
                <ProductSelector ref="selectors" v-if="props.creatingTransaction" :productId="product.id" />
            </div>
        </div> 
    </div>
    <ProductDetailsModal 
        :open="showProductDetails" 
        :productDetails="productDetails" 
        @close="showProductDetails = false"
    />
    <ProductInsertModal
        :open="showInsertNewProduct" 
        @close="showInsertNewProduct = false"
        @
    />
    <!--<ProductEdit ref="modalRef" :onProductAdded="updateProducts" :shopId="shopId" :productId="detailsProductId"/>-->
</template>