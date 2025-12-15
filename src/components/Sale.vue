<script setup lang="ts">
    import { ref } from "vue";

    const props = defineProps({
        onTransactionOpen: Function,
        isShopOwner: Boolean
    });

    const emit = defineEmits(['confirmTransaction']);

    const transactionMode = ref(false);
    
    function toggleTransaction(){
        transactionMode.value = !transactionMode.value;
        props.onTransactionOpen!();
    }
</script>

<template>
    <div class="flex flex-row">
        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-fed-green text-white rounded-xl" @click="toggleTransaction" v-if="!transactionMode">{{ $t("shop.transazioni.nuova") }}</button>
        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-lime-700 text-white rounded-xl" @click="$emit('confirmTransaction')" v-if="transactionMode">{{ $t("shop.transazioni.conferma") }}</button>
        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-red-700 text-white rounded-xl" v-if="transactionMode" @click="toggleTransaction">{{ $t("shop.transazioni.annulla") }}</button>
    </div>
</template>