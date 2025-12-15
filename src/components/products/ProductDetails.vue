<script setup lang="ts">
    import { ref } from "vue";
    import type { Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();

    const props = defineProps({
        shopId: String,
        productId: String
    });

    const product: Ref<any> = ref<any>(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    async function open() {
        product.value = await fetch(`${backendAPI}/shops/${props.shopId}/products/${props.productId}`)
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
                    <h2 class="text-3xl font-bold">{{ product.name }}</h2>
                    <img
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                    <ul class="py-4">
                        <li class="text-xl">{{ `${t('product.descrizione')}: ${product.description}` }}</li>
                        <li class="text-xl">{{ `${t('product.origine')}: ${product.origin}` }}</li>
                        <li class="text-xl">{{ `${t('product.punti')}: ${product.points}` }}</li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <form method="dialog">
                    <button class="btn">{{ `${t('button.chiudi')}` }}</button>
                </form>
            </div>
        </div>
    </dialog>
</template>