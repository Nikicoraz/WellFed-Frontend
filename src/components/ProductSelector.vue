<script setup lang="ts">
    import { ref } from 'vue';

    const count = ref(0);

    function decrease(){
        if(count.value > 0)
            count.value--;
    }

    function increase(){
        count.value++;
    }

    function getCount() : number {
        return count.value;
    }

    defineExpose({getCount})
</script>

<template>
    <div class="flex join w-full">
        <button class="flex-1 join-item btn text-2xl" @click="decrease">-</button>
        <input class="join-item flex-1 input bg-base-100 text-center" disabled type="text" :value="count"></input>
        <button class="flex-1 join-item btn text-2xl" @click="increase">+</button>
    </div>
</template>