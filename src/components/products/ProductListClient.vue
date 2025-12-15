<script setup lang="ts">
    import ProductCard from "./ProductCard.vue";
    import ProductDetails from "./ProductDetails.vue";
    import { ref, onMounted, nextTick, type Ref } from "vue";
    import Alert from "../util/Alert.vue";
    import AlertType from "../../types/alert";
    import { useI18n } from "vue-i18n";
    import cookies from "vue-cookies";
    import { useRoute } from "vue-router";

    const {t} = useI18n();
    const route = useRoute();

    const props = defineProps({
        shopId: String,
        editable: Boolean,
        creatingTransaction: Boolean
    });

    // useRoute prende il parametro :shopId definito nella route
    const products: Ref<any[], any[]> = ref([]);
    const detailsProductId = ref("");
    const modalRef: Ref<any> = ref(null);

    async function showDetails(productId: string) {
        detailsProductId.value = productId;
        await nextTick();
        modalRef.value?.open();
    }

    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const productId = route.query.product;

    products.value = await fetch(`${backendAPI}/shops/${props.shopId}/products`)
        .then((res) => { return res.json() })
</script>

<template>
    <div v-if="products.length > 0" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">{{ $t('shop.prodotti') }}</h1>
        <div class="grid grid-cols-4 gap-4">
            <div v-for="product in products">
                <ProductCard :shopId="shopId" :key="product" :productId="product.id" @showDetails="showDetails" :class="props.creatingTransaction ? 'rounded-b-none' : ''" />
            </div>
        </div> 
    </div>
    <ProductDetails ref="modalRef" :shopId="shopId" :productId="detailsProductId" />
    <Alert ref="alertRef" />
</template>