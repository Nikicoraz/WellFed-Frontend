<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref } from 'vue';
    import ProductListMerchant from '../../components/products/ProductListMerchant.vue';
    import ShopInfo from '../../components/ShopInfo.vue';
    import TransactionButtons from '../../components/TransactionButtons.vue';
    import PrizeListMerchant from '../../components/prizes/PrizeListMerchant.vue';
    import LogoutButton from '../../components/util/LogoutButton.vue';
import TransactionListButton from '../../components/transactions/TransactionListButton.vue';

    type ProductListExposed = {
        generateQR: () => void;
    };

    const shopId = ref(useRoute().params.shopId as string);
    const isCreatingTransaction = ref(false);
    const productList = ref<ProductListExposed | null>(null);

    function toggleTransaction() {
        isCreatingTransaction.value = !isCreatingTransaction.value;
    }

    function confirmTransaction() {
        if (productList.value) {
            productList.value.generateQR();
        }
        toggleTransaction();
    }
</script>

<template>
    <LogoutButton class="absolute right-8 top-12 bg-fed-green text-white" />
    <TransactionListButton class="absolute right-30 top-12 border-black" />
    <div class="w-3/4 p-8 mx-auto">
        <TransactionButtons 
            :shopId="shopId" 
            @transaction-opened="toggleTransaction" 
            @transaction-closed="toggleTransaction" 
            @transaction-confirmed="confirmTransaction"
        />
        <ShopInfo :shopId="shopId"/>
        <ProductListMerchant ref="productList" :shopId="shopId" :isCreatingTransaction="isCreatingTransaction"/>
        <PrizeListMerchant :shopId="shopId" />
    </div>
</template>