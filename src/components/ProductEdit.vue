<script setup lang="ts">
    import { ref } from "vue";
    import type { Ref } from "vue";

    const props = defineProps({
        shopId: String,
        productId: String
    });

    const product: Ref<any> = ref<any>(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);

    // TODO: L'immagine dovrebbe essere tipo una template image
    const emptyProduct = {
        name: "",
        description: "",
        origin: "",
        points: "",
        image: ""
    }

    const dialog: Ref<any> = ref(null);
    const empty = ref(false);

    async function open() {
        if(props.shopId != "" && props.productId != "") {
            product.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products/${props.productId}`)
                .then((res) => { return res.json(); });
            if (dialog.value) {
                empty.value = false;
                dialog.value.showModal();
            }
        }else{
            product.value = emptyProduct;
            empty.value = true;
            dialog.value.showModal();
        }
    }

    function save() {

    }

    defineExpose({ open });
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div v-if="product" class="modal-box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ empty ? $t("shop.nuovoProdotto") : product.name }}</h2>
                    <img
                        v-if="!empty"
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                    <div class="grid grid-cols-2 gap-y-4 my-4">
                        <span class="text-xl label">{{ $t("shop.nome") }}:</span>
                        <input class="input validator" type="text" :value="product.name">

                        <span class="text-xl label">{{ $t("shop.descrizione") }}:</span>
                        <textarea class="validator textarea resize-none">{{ product.description }}</textarea>

                        <span class="text-xl label">{{ $t("shop.origine") }}:</span>
                        <input class="input validator" :value="product.origin">

                        <span class="text-xl label">{{ $t("shop.punti") }}:</span>
                        <input type="number" min="0" class="input validator" :value="product.points">

                        <span class="text-xl label">{{ $t("shop.immagine") }}:</span>
                        <input type="file" class="input file-input validator">
                    </div>
                </div>
            </div>
            <div class="my-4 modal-action">
                <form method="dialog">
                    <button class="btn">{{ $t("shop.annulla") }}</button>
                </form>
                <button @click="save" class="btn bg-lime-700 text-white">{{ $t("shop.salva") }}</button>
            </div>
        </div>
    </dialog>
</template>