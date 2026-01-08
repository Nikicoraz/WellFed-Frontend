<script setup lang="ts">
    import { ref, watch } from 'vue';

    const props = defineProps<{
        src: string,
        alt: string
    }>();

    const placeholder_path = "/placeholder.png";    // Per i path in /public si può mettere anche solo il nome
    const final_src = ref(props.src);


    function checkImage() {
        final_src.value = props.src;
        fetch(props.src).then((e) => {
            if (e.status == 404) {
                final_src.value = placeholder_path;
            }
        });
    }

    checkImage();
    watch(() => props.src, (_) => {
        checkImage();
    });
</script>

<template>
    <img :src="final_src" :alt="alt">
</template>