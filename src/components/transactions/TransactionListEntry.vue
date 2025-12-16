<script setup lang="ts">
    const props = defineProps(['transaction']); // non ho idea di che tipo sia
    const emits = defineEmits(['showTransactionDetails']);
</script>

<template>
    <div v-if="props.transaction" class="card card-side bg-base-100 shadow-sm m-4 cursor-pointer" @click="$emit('showTransactionDetails', transaction)">
        <div class="card-body rounded-md flex-row justify-between p-2" :class="props.transaction.transactionStatus == 'Success' ? 'bg-lime-600' : 'bg-red-400'">
            <div class="card-title text-white text-md">{{ props.transaction.transactionType }}</div>
            <div class="card-title text-white text-sm">{{ props.transaction.points }}</div>
        </div>
    </div>
</template>