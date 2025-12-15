<script setup lang="ts">
    import { ref, type Ref } from 'vue';
    import NavBar from '../components/NavBar.vue';
    import TransactionModal from '../components/transactions/TransactionListModal.vue';

    const showTransactionListModal: Ref<boolean> = ref(false);
    // const transactionModalRef: Ref<InstanceType<typeof TransactionModal> | null> = ref(null);
</script>

<template>
    <NavBar @show-transaction-list-modal="showTransactionListModal = true" />
    <TransactionModal :open="showTransactionListModal" @close="showTransactionListModal = false" />
    <RouterView />
</template>
