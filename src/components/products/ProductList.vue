<script setup lang="ts">
    import ProductListClient from './ProductListClient.vue';
    import ProductListMerchant from './ProductListMerchant.vue';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import VueCookies from 'vue-cookies';

    const cookies = (VueCookies as any);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    type ProductListMerchantExposed = {
        generateQR: () => void;
    };

    const props = defineProps({
        isCreatingTransaction: Boolean
    });

    const currentMerchantID: string | undefined = cookies.get("merchantID");
    const shopId = ref(useRoute().params.shopId as string);
    const isOwner = ref(shopId.value == currentMerchantID);
    const productListMerchant = ref<ProductListMerchantExposed | null>(null);

    // un po' brutto per la ripetizione di codice
    function generateQR(): void {
        if (productListMerchant.value) {
            return productListMerchant.value.generateQR();
        } else {
            return;
        }
    }

    const shop = ref();

    onMounted(async () => {
        shop.value = ref(await fetch(`${backendAPI}/shops/${shopId.value}`)
            .then((res) => { return res.json(); })
            .catch((e) => { console.error(e); })
        );
    });

    defineExpose({generateQR});
</script>

<template>
    <div v-if="shop">
        <div v-if="isOwner">
            <ProductListMerchant ref="productListMerchant" :shop-id="shopId" :isCreatingTransaction="props.isCreatingTransaction"/>
        </div>
        <div v-else-if="!isOwner && !currentMerchantID">
            <ProductListClient :shop-id="shopId"/>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
        Qualcosa è andato storto
    </div>
</template>