<script setup lang="ts">
    // Bottone che fa emit di un evento per aprire il modal
    defineEmits(['showTransactionListModal']);
</script>

<template>
    <div class="w-10 mx-10 rounded-full bg-white" @click="$emit('showTransactionListModal')">
        <!-- TODO: mettere alt -->
        <img class="scale-50" src="../../assets/transaction.svg" alt=""> 
    </div>
</template>