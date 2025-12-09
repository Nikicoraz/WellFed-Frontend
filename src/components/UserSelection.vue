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
    <div class="cursor-pointer text-center h-20 outline outline-black/10 shadow-lg rounded-2xl" @click="props.callback!">
        {{ $t(props.name!) }}
        <div class="hover-3d w-full">
            <figure class="w-full">
                <img :src="props.image" alt="" class="aspect-square w-full h-10">
            </figure>

            <!-- 8 empty divs needed for the 3D effect -->
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

        </div>
    </div>
</template>