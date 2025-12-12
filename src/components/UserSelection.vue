<script setup lang="ts">
    const props = defineProps({
        name: String,
        image: String,
        callback: Function
    });

    if(!props.callback) {
        console.error("No callback set");
    }
</script>

<template>
    <div class="text-center h-20 scale-100 outline px-4 outline-black/20 hover:outline-lime-900 duration-400 transition-all rounded-xl cursor-pointer hover:scale-105" @click="props.callback!">
        {{ $t(props.name!) }}
        <div class="w-full">
            <figure class="w-full">
                <img :src="props.image" alt="" class="aspect-square w-full h-10">
            </figure>
        </div>
    </div>
</template>