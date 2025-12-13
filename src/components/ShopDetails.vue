<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import type { Ref } from "vue";

    const props = defineProps({
        shopId: String,
        onTransactionOpen: Function
    });

    const emit = defineEmits(['confirmTransaction']);

    const shop: Ref<any> = ref(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const transactionMode = ref(false);
    
    function toggleTransaction(){
        transactionMode.value = !transactionMode.value;

        props.onTransactionOpen!();
    }

    onMounted(async () => {
        shop.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}`)
            .then((res) => { return res.json(); });
    });
</script>

<template>
    <div v-if="shop" class="hero w-full">
        <div class="hero-content size-full justify-around flex flex-row gap-4">
        
            <div class="flex-1 h-full flex">
                <img
                    :src="`${backendUrl}${shop.image}`"
                    alt="shop image"
                    class="rounded-xl max-h-full object-contain mx-auto"
                />
            </div>

            <div class="flex-1 h-full flex flex-col justify-around">
                <div>
                    <h1 class="text-3xl md:text-6xl text-center font-bold">{{ shop.name }}</h1>
                    <p class="text-center py-4"> {{ shop.address }} </p>
                    <div class="flex flex-col">
                        <!-- TODO: Traduzioni -->
                        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-fed-green text-white rounded-xl" @click="toggleTransaction" v-if="!transactionMode">Nuova transazione</button>
                        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-lime-700 text-white rounded-xl" @click="$emit('confirmTransaction')" v-if="transactionMode">Conferma transazione</button>
                        <button class="btn text-xl px-12 py-8 w-6/12 m-auto bg-red-700 text-white rounded-xl" v-if="transactionMode" @click="toggleTransaction">Annulla Transazione</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>