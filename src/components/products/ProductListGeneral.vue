<script setup lang="ts">
    import ProductListClient from './ProductListClient.vue';
    import ProductListMerchant from './ProductListMerchant.vue';
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import VueCookies from 'vue-cookies';

    const cookies = (VueCookies as any);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const currentMerchantID: string | undefined = cookies.get("merchantID");

    const shopId = ref(useRoute().params.shopId as string);

    const isOwner = ref(shopId.value == currentMerchantID);
    const shop = ref(await fetch(`${backendAPI}/shops/${shopId.value}`)
        .then((res) => { return res.json(); })
        .catch((e) => { console.error(e) })
    );
</script>

<template>
    <div v-if="shop">
        <div v-if="isOwner">
            <ProductListMerchant :shop-id="shopId"/>
        </div>
        <div v-else-if="!isOwner && !currentMerchantID">
            <ProductListClient :shop-id="shopId"/>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
        oiajwdoji
    </div>
</template>