<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref } from 'vue';
    import ProductListClient from '../../components/products/ProductListClient.vue';
    import ShopInfo from '../../components/ShopInfo.vue';
    import NavBar from '../../components/NavBar.vue';

    const shopId = ref(useRoute().params.shopId as string);
</script>

<template>
    <div class="min-h-screen bg-fed-bg">
        <NavBar />
        <div class="w-3/4 p-8 mx-auto">
            <ShopInfo :shopId="shopId"/>
            <ProductListClient :shopId="shopId"/>
        </div>
    </div>
</template>