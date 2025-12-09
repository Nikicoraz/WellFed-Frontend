<script setup lang="ts">
    import { ref, onMounted } from "vue";
    const props = defineProps({
        shopId: String,
        productId: String
    })

    const product = ref(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);

    onMounted(async () => {
        product.value = await fetch(`http://127.0.0.1:8000/api/v1/shops/${props.shopId}/products/${props.productId}`)
            .then((res) => { return res.json(); });
    });
</script>

<template>
    <div class="card card-border shadow rounded-xl">
        <div class="card-body" v-if="product">
            <figure>
                <img
                    :src="`${backendUrl}${product.image}`"
                    :alt="product.name"
                />
            </figure>
            <h1 class="card-title">{{ product.name }}</h1>
            <p>{{ product.description }}</p>
            <p>{{ product.origin }}</p>
            <p>{{ product.points }}</p>
        </div>
    </div>
</template>