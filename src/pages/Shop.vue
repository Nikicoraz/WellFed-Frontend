<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import type { Ref } from 'vue';
    import ProductsCustomer from '../components/ProductsCustomer.vue';

    const shopId = ref(useRoute().params.shopId as string);

    const shop: Ref<any> = ref(null);
    onMounted(async () => {
        shop.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${shopId.value}`)
            .then((res) => { return res.json(); });
    });
</script>

<template>
    <div class="w-3/4 p-8 mx-auto" v-if="shop">
        <h1 class="text-3xl">{{ shop.name }}</h1>
        <ProductsCustomer :shopId="shopId"/>
    </div>
</template>