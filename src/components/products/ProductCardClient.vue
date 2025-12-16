<script setup lang="ts">
    import { ref } from "vue";

    const props = defineProps({
        shopId: String,
        productId: String,
        editable: Boolean
    });

    const emit = defineEmits(['showDetails', 'edit']);

    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const product = ref(await fetch(`${backendAPI}/shops/${props.shopId}/products/${props.productId}`)
        .then((res) => { return res.json(); })
    );
</script>

<template>
    <div
        v-if="product"
        @click="$emit('showDetails', product)"
        class="bg-base-100 card card-border shadow rounded-xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
    >
        <div class="card-body h-100">
            <figure>
                <div class="aspect-square overflow-hidden rounded-xl">
                    <img
                        class="w-full h-full object-cover"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                </div>
            </figure>
            <div class="flex justify-between mt-6">
                <h1 class="text-2xl card-title w-8/12"><p class="truncate">{{ product.name }}</p></h1>
                <div class="bg-lime-700 text-white border rounded-lg btn"> {{ product.points ?? 0 }} </div>
            </div>
            <div v-if="editable" class="absolute top-8 left-8 bg-base-200 p-2 rounded-xl" @click="$emit('edit')">
                <img class="scale-50" src="../../assets/pencil.svg" alt="">
            </div>
        </div>
    </div>
</template>