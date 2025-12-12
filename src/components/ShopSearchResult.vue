<script lang="ts">
    interface Shop {
        id: String,
        name: String,
        address: String,
        image: String
    }

    function getImageUrl(imageURL: String): string{
        return import.meta.env.VITE_BACKEND_URL + "/public/images/merchants/" + imageURL;
    }
</script>

<script setup lang="ts">
import { router } from '../extensions/router';

    const props = defineProps<{
        shop: Shop
    }>();

</script>

<template>
    <div class="card card-side bg-base-100 shadow-sm m-4 cursor-pointer" @click="router.push('/shop/' + shop.id)">
        <figure>
            <img :src="getImageUrl(shop.image)" class="h-40 w-60 object-fill">
        </figure>
        <div class="card-body p-0">
            <div class="bg-fed-green p-4 flex w-full justify-between">
                <h2 class="card-title text-white text-2xl">{{ shop.name }}</h2>
                <img src="../assets/shop.svg" class="h-10 fill-white" alt="">
            </div>
            <div class="py-2 px-4">
                <p>{{ shop.address }}</p>
            </div>
        </div>
    </div>
</template>