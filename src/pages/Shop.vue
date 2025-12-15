<script setup lang="ts">
    import ShopClientView from './ShopClientView.vue';
    import ShopMerchantView from './ShopMerchantView.vue';
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
            <ShopMerchantView :shop-id="shopId" :shop-data="shop.value" />
        </div>
        <div v-else-if="!isOwner && !currentMerchantID">
            <ShopClientView :shop-id="shopId" :shop-data="shop.value" />
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
        No shop was found :(
    </div>
</template>