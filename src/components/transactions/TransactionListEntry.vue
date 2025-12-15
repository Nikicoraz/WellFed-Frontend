<script setup lang="ts">
    const props = defineProps(['transaction']); // non ho idea di che tipo sia
    defineEmits(['showTransactionDetailsModal']);
</script>

<template>
    <div v-if="transaction" class="card card-side bg-base-100 shadow-sm m-4 cursor-pointer" @click="$emit('showTransactionDetailsModal', transaction)">
        <div class="card-body flex-row justify-between p-2" :class="props.transaction.transactionStatus == 'Success' ? 'bg-green-400' : 'bg-red-400'">
            <div class="card-title text-white text-md">{{ props.transaction.transactionType }}</div>
            <div class="card-title text-white text-sm">{{ props.transaction.points }}</div>
        </div>
    </div>
</template>