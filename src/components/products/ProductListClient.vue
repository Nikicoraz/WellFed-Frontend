<script setup lang="ts">
    import ProductCardClient from "./ProductCardClient.vue";
    import ProductDetailsModal from "./ProductDetailsModal.vue";
    import { onMounted, ref, type Ref } from "vue";
    import { useRoute } from "vue-router";

    const route = useRoute();

    const props = defineProps({
        shopId: String
    });

    const products: Ref<any[], any[]> = ref([]);
    const showProductDetails = ref(false);
    const productDetails = ref(null);

    // da mettere l'interfaccia
    function showDetails(product: any) {
        productDetails.value = product;
        showProductDetails.value = true;
    }

    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;


    onMounted(async () => {
        products.value = await fetch(`${backendAPI}/shops/${props.shopId}/products`)
            .then((res) => { return res.json() });

        // Rerouting dalla ricerca
        const productId = (route.query.product as string);
        if (productId) {
            const product = await fetch(`${backendAPI}/shops/${props.shopId}/products/${productId}`).then((res) => { return res.json(); });
            showDetails(product);
        }
    });
</script>

<template>
    <div v-if="products.length > 0" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">{{ $t('shop.prodotti') }}</h1>
        <div class="grid grid-cols-4 gap-4">
            <ProductCardClient v-for="product in products"
                :product="product"
                :editable="false"
                @show-details="showDetails" 
            />
        </div> 
    </div>
    <ProductDetailsModal 
        :open="showProductDetails" 
        :productDetails="productDetails" 
        @close="showProductDetails = false"
    />
</template>