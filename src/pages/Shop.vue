<script setup lang="ts">
    import ProductCard from "../components/ProductCard.vue";
    import { ref, onMounted } from "vue";
    const shopId = ref("693873be10f99ed16b9a8119");
    const products = ref([]);

    onMounted(async () => {
        products.value = await fetch("http://127.0.0.1:8000/api/v1/shops/693873be10f99ed16b9a8119/products")
            .then((res) => { return res.json() });
    });
</script>

<template>
    <h1> Prodotto </h1>
    <ProductCard v-if="products.length > 0" :shopId="shopId" :productId="products[0].id"/>
</template>