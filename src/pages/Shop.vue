<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import type { Ref } from 'vue';
    import ProductsCustomer from '../components/ProductListCustomer.vue';
    import ShopDetails from '../components/ShopDetails.vue';

    const shopId = ref(useRoute().params.shopId as string);

    const shop: Ref<any> = ref(null);
    onMounted(async () => {
        shop.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${shopId.value}`)
            .then((res) => { return res.json(); });
    });
</script>

<template>
    <div v-if="shop" class="w-3/4 p-8 mx-auto">
        <ShopDetails :shopId="shopId"/>
        <ProductsCustomer :shopId="shopId"/>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
        <div>
            No shop was found :(
        </div>
    </div>
</template>