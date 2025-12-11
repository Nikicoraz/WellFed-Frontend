<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import type { Ref } from "vue";

    const props = defineProps({
        shopId: String,
        productId: String
    });

    const emit = defineEmits(['showDetails']);

    const product: Ref<any> = ref(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);

    onMounted(async () => {
        product.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products/${props.productId}`)
            .then((res) => { return res.json(); });
    });
</script>

<template>
    <div v-if="product" @click="$emit('showDetails', productId)">
        <div class="card card-border cursor-pointer shadow rounded-xl">
            <div class="card-body">
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
                    <div class="flex">
                        <h1 class="text-2xl card-title">{{ product.name }}</h1>
                    </div>
                    <div class="bg-lime-700 text-white border rounded-lg btn"> {{ product.points }} </div>
                </div>
            </div>
        </div>
    </div>
</template>