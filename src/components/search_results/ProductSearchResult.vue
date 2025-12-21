<script lang="ts">
    import productIcon from "/src/assets/product.svg";

    interface Product {
        id: String,
        name: String,
        description: String,
        origin: String,
        image: String,
        points: Number,
        shopID: String
    }

    function getImageUrl(imageURL: String): string{
        return import.meta.env.VITE_BACKEND_URL + imageURL;
    }
</script>

<script setup lang="ts">
    import { router } from '../../extensions/router';

    const props = defineProps<{
        product: Product
    }>();
</script>

<template>
    <div class="card card-side bg-base-100 shadow-sm m-4 overflow-y-scroll cursor-pointer" 
        @click="router.push({
            path: '/shop/' + product.shopID,
            query: {
                product: String(product.id)
            }
        })
    ">
        <figure>
            <img :src="getImageUrl(product.image)" class="h-40 w-60 object-fill">
        </figure>
        <div class="card-body p-0">
            <div class="bg-fed-green p-4 flex justify-between">
                <h2 class="card-title text-white text-2xl">{{ product.name }}</h2>
                <img :src="productIcon" alt="" class="h-10">
            </div>
            <div class="py-2 px-4">
                <p>{{ product.description }}</p>
                <p>{{ $t("ricerca.origine") }}: {{ product.origin }}</p>
                <p>{{ $t("ricerca.punti") }}: {{ product.points }}</p>
            </div>
        </div>
    </div>
</template>