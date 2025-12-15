<script setup lang="ts">
    import { ref, type Ref } from 'vue';
    import NavBar from '../components/NavBar.vue';
    import TransactionListModal from '../components/transactions/TransactionListModal.vue';
    import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal.vue';

    const showTransactionListModal: Ref<boolean> = ref(false);
    const showTransactionDetailsModal: Ref<boolean> = ref(false);
    const selectedTransaction: Ref<any> = ref(null);
</script>

<template>
    <NavBar 
        @show-transaction-list-modal="showTransactionListModal = true" 
    />
    <TransactionListModal 
        :open="showTransactionListModal" 
        @close="showTransactionListModal = false" 
        @show-transaction-details-modal="(transaction) => { showTransactionDetailsModal = true; selectedTransaction = transaction }"
    />
    <TransactionDetailsModal 
        :open="showTransactionDetailsModal" 
        :transaction="selectedTransaction"
        @close="showTransactionDetailsModal = false" 
    />
    <RouterView />
</template>
