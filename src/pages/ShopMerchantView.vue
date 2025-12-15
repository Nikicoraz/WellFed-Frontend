<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref } from 'vue';
    import ProductList from '../components/ProductList.vue';
    import ShopInfo from '../components/ShopInfo.vue';
    import Sale from '../components/Sale.vue';

    const shopId = ref(useRoute().params.shopId as string);
    const creatingTransaction = ref(false);
    const productList = ref<typeof ProductList | null>(null);

    function toggleTransaction(){
        creatingTransaction.value = !creatingTransaction.value;
    }

    function confirmTransaction() {
        productList.value!.createTransactionQR();
    }
</script>

<template>
    <div class="min-h-screen bg-fed-bg">
        <Sale :shopId="shopId" :onTransactionOpen="toggleTransaction" @confirmTransaction="confirmTransaction"/>
        <ShopInfo :shopId="shopId" />
        <!--<ProductList ref="productList" :shopId="shopId" :editable="isShopOwner" :creatingTransaction="creatingTransaction" />-->
    </div>
</template>