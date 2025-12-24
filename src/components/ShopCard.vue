<script setup lang="ts">
    import { ref, type Ref } from "vue";

    const props = defineProps(['shop', 'points']);
    const emits = defineEmits(['redirect']);
    
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
</script>

<template>
    <div
        v-if="props.shop"
        @click="$emit('redirect', props.shop)"
        class="bg-base-100 card card-side h-80 shadow rounded-xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
    >
        <figure class="w-1/2">
            <div class="aspect-square overflow-hidden rounded-xl">
                <img
                    class="w-full h-full object-cover"
                    :src="`${backendUrl}${props.shop.image}`"
                    :alt="props.shop.name"
                />
            </div>
        </figure>
        <div class="card-body flex flex-col justify-around">
            <div class="text-2xl m-auto  card-title">{{ props.shop.name }}</div>
            <div class="text-lime-700 text-3xl m-auto">{{ props.points ?? 0 }}</div>
        </div>
    </div>
</template>