<script setup lang="ts">
    import { ref } from "vue";
    import type { Ref } from "vue";

    const props = defineProps({
        shopId: String,
        productId: String
    });

    const product: Ref<any> = ref<any>(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);

    const dialog: Ref<any> = ref(null);

    async function open() {
        product.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products/${props.productId}`)
            .then((res) => { return res.json(); });
        if (dialog.value) {
            dialog.value.showModal();
        }
    }

    defineExpose({ open });
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div v-if="product" class="modal-box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-2xl font-bold">{{ product.name }}</h2>
                    <img
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                    <ul class="py-4">
                        <li>Description: {{ product.description }}</li>
                        <li>Origin: {{ product.origin }}</li>
                        <li>Points: {{ product.points }}</li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
</template>