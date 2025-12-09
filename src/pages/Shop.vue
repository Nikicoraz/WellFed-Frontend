<script setup lang="ts">
    import ProductCard from "../components/ProductCard.vue";
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router';

    // useRoute prende il parametro :shopId definito nella route
    const shopId = useRoute().params.shopId as string;
    const products = ref([]);

    onMounted(async () => {
        products.value = await fetch(`http://127.0.0.1:8000/api/v1/shops/${shopId}/products`)
            .then((res) => { return res.json() });
    });
</script>

<template>
    <div class="w-3/4 mx-auto p-8">
        <h1 class="text-3xl font-bold"> Prodotti </h1>
        <div class="flex flex-row flex-wrap">
            <ProductCard v-for="product in products" :shopId="shopId" :productId="product.id"/>
        </div>
    </div>
</template>