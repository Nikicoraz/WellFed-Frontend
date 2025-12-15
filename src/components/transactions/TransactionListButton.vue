<script setup lang="ts">
    defineEmits(['showTransactionListModal']);
</script>

<template>
    <div class="w-10 mx-10 rounded-full bg-white" @click="$emit('showTransactionListModal')">
        <!--mettere alt-->
        <img class="scale-50" src="../../assets/transaction.svg" alt=""> 
    </div>
</template>