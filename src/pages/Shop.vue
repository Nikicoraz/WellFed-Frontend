<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import type { Ref } from 'vue';
    import ProductList from '../components/ProductList.vue';
    import ShopDetails from '../components/ShopDetails.vue';
    import  VueCookies from 'vue-cookies';
import QRScanner from '../components/QRScanner.vue';

    const shopId = ref(useRoute().params.shopId as string);
    const currentMerchantID: string | undefined = (VueCookies as any).get("merchantID");
    const creatingTransaction = ref(false);
    const productList = ref<typeof ProductList | null>(null);


    const shop: Ref<any> = ref(null);
    const isShopOwner = shopId.value == currentMerchantID;
    onMounted(async () => {
        shop.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${shopId.value}`)
            .then((res) => { return res.json(); });
    });

    function toggleTransaction(){
        creatingTransaction.value = !creatingTransaction.value;
    }

    function confirmTransaction() {
        productList.value!.createTransactionQR();
    }
</script>

<template>
    <div class="min-h-screen bg-fed-bg">
        <div v-if="shop" class="w-3/4 p-8 mx-auto">
            <ShopDetails :shopId="shopId" :onTransactionOpen="toggleTransaction" :isShopOwner="isShopOwner" @confirmTransaction="confirmTransaction"/>
            <ProductList ref="productList" :shopId="shopId" :editable="isShopOwner" :creatingTransaction="creatingTransaction" />
        </div>
        <div v-else class="flex items-center justify-center h-screen">
            <div>
                No shop was found :(
            </div>
        </div>
        <QRScanner />
    </div>
</template>