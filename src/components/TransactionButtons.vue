<script setup lang="ts">
    import { ref } from "vue";

    const emit = defineEmits(['transactionConfirmed', 'transactionOpened', 'transactionClosed']);

    const isCreatingTransaction = ref(false);
    
    function toggleTransaction(){
        isCreatingTransaction.value = !isCreatingTransaction.value;
    }
</script>

<template>
    <div class="flex flex-row">
        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-fed-green text-white rounded-xl" 
            v-if="!isCreatingTransaction"
            @click="() => { 
                toggleTransaction();
                $emit('transactionOpened');
            }" 
        >{{ $t("shop.transazioni.nuova") }}</button>

        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-lime-700 text-white rounded-xl" 
            v-if="isCreatingTransaction"
            @click="() => {
                toggleTransaction();
                $emit('transactionConfirmed');
            }"
        >{{ $t("shop.transazioni.conferma") }}</button>

        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-red-700 text-white rounded-xl" 
            v-if="isCreatingTransaction"
            @click="() => {
                toggleTransaction();
                $emit('transactionClosed');
            }"
        >{{ $t("shop.transazioni.annulla") }}</button>
    </div>
</template>