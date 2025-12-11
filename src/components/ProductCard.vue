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
                    <img class="aspect-square"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                </figure>
                <h1 class="card-title">{{ product.name }}</h1>
                <p>{{ product.points }}</p>
            </div>
        </div>
    </div>
</template>