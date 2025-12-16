<script setup lang="ts">
    import TransactionListModal from './TransactionListModal.vue';
    import { ref } from "vue";
    const showTransactionListModal = ref(false);
</script>

<template>
    <div>
        <button class="btn btn-circle mx-10" @click="showTransactionListModal = true">
            <!-- TODO: mettere alt -->
            <img class="scale-50" src="../../assets/transaction.svg" alt=""> 
        </button>
        <TransactionListModal 
            :open="showTransactionListModal" 
            @close="showTransactionListModal = false"
        />
    </div>
</template>