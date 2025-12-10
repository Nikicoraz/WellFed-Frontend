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
    <div class="hover-3d cursor-pointer" @click="props.callback!">
        <div class="text-center h-20 outline px-4 outline-black/10 shadow-lg rounded-2xl">
            {{ $t(props.name!) }}
            <div class="w-full">
                <figure class="w-full">
                    <img :src="props.image" alt="" class="aspect-square w-full h-10">
                </figure>
    
            </div>
        </div>

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
</template>