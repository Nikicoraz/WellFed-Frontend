<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import type { Ref } from "vue";

    const props = defineProps({
        shopId: String
    });

    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const shop = ref(await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}`)
        .then((res) => { return res.json(); })
    );
</script>

<template>
    <div v-if="shop" class="hero w-full">
        <div class="hero-content size-full justify-around flex flex-row gap-4">
            <div class="flex-1 h-full flex">
                <img
                    :src="`${backendUrl}${shop.image}`"
                    :alt="$t('shop.altImmagineNegozio')"
                    class="rounded-xl max-h-full object-contain mx-auto"
                />
            </div>

            <div class="flex-1 h-full flex flex-col justify-around">
                <div>
                    <h1 class="text-3xl md:text-6xl text-center font-bold">{{ shop.name }}</h1>
                    <p class="text-center py-4"> {{ shop.address }} </p>
                </div>
            </div>
        </div>
    </div>
</template>