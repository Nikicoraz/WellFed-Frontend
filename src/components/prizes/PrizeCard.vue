<script setup lang="ts">
    import { ref } from "vue";
    import SafeImage from "../SafeImage.vue";

    const props = defineProps(['prize', 'editable']);
    const emit = defineEmits(['showDetails', 'edit']);

    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
</script>

<template>
    <div
        v-if="props.prize"
        @click="$emit('showDetails', props.prize)"
        class="bg-base-100 card card-border shadow rounded-xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
    >
        <div class="card-body h-100">
            <figure>
                <div class="aspect-square overflow-hidden rounded-xl">
                    <SafeImage
                        class="w-full h-full object-cover"
                        :src="`${backendUrl}${props.prize.image}`"
                        :alt="props.prize.name"
                    />
                </div>
            </figure>
            <div class="flex justify-between mt-6">
                <h1 class="text-2xl card-title w-8/12"><p class="truncate">{{ props.prize.name }}</p></h1>
                <div class="bg-lime-700 text-white border rounded-lg btn"> {{ props.prize.points ?? 0 }} </div>
            </div>
            <div v-if="editable" class="absolute top-8 left-8 bg-base-200 p-2 rounded-xl" @click.stop="$emit('edit', props.prize.id)">
                <img class="scale-50" src="../../assets/pencil.svg" alt="">
            </div>
        </div>
    </div>
</template>