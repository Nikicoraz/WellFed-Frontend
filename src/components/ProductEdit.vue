<script setup lang="ts">
    import { ref } from "vue";
    import type { Ref } from "vue";
    import { validateInputs } from "../extensions/formValidation";
    import cookies  from 'vue-cookies'
    import { useI18n } from "vue-i18n";
    import Alert from "./Alert.vue";
    import AlertType from "../types/alert";

    const props = defineProps({
        shopId: String,
        productId: String,
        onProductAdded: Function
    });

    const product: Ref<any> = ref<any>(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const {t} = useI18n();

    // TODO: L'immagine dovrebbe essere tipo una template image
    const emptyProduct = {
        name: "",
        description: "",
        origin: "",
        points: "",
        image: ""
    }

    const alert = ref<typeof Alert | null>(null);
    const dialog: Ref<any> = ref(null);
    const box: Ref<any> = ref(null);
    const empty = ref(false);
    const form = ref<HTMLDivElement | null>(null);
    const name = ref("");
    const description = ref("");
    const origin = ref("");
    const points = ref(0);
    const image = ref<HTMLInputElement | null>(null);

    const assignsPoints = ref(true);

    async function open() {
        // Usando .show al posto di showModal si può avere un elemento sopra il modal (l'alert), però non fa il reset dello scroll
        // quando si apre, quindi lo resetto io nel caso fosse già stato aperto un modal
        if(box.value) {
            box.value.scrollTo({top: 0});
        }

        if(props.shopId != "" && props.productId != "") {
            product.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products/${props.productId}`)
                .then((res) => { return res.json(); });
            if (dialog.value) {
                empty.value = false;
                dialog.value.show();
            }
        }else{
            product.value = {...emptyProduct};
            empty.value = true;
            dialog.value.show();
        }
        
        name.value = product.value.name;
        description.value = product.value.description;
        origin.value = product.value.origin;
        points.value = product.value.points;
        assignsPoints.value = true;
        if(image.value){
            image.value.value = "";
        }
    }

    function createNewProduct(data: FormData, token: string){
        fetch(import.meta.env.VITE_BACKEND_URL_API + `/shops/${props.shopId!}/products`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }).then(e => {
            switch (e.status) {
                case 201:
                    dialog.value.close();
                    alert.value!.showError(AlertType.Success, t("shop.prodotto.creato"));
                    if(props.onProductAdded){
                        props.onProductAdded();
                    }
                    break;
                default:
                    alert.value!.showError(AlertType.Error, e.status + ": " + t("alerts.datiNonValidi"))
                    break;
            }
        })
    }

    function updateExistingProduct(data: FormData, token: string){
        fetch(import.meta.env.VITE_BACKEND_URL_API + `/shops/${props.shopId!}/products/${props.productId!}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }).then(e => {
            switch (e.status) {
                case 200:
                    dialog.value.close();
                    alert.value!.showError(AlertType.Success, t("shop.prodotto.aggiornato"));
                    if(props.onProductAdded){
                        props.onProductAdded();
                    }
                    break;
                default:
                    alert.value!.showError(AlertType.Error, e.status + ": " + t("alerts.datiNonValidi"))
                    break;
            }
        })
    }

    function save() {
        if(!validateInputs(form.value!)){
            return
        }

        if(!image.value || !image.value.files) {
            alert.value!.showError(AlertType.Error, t("alerts.noimage"));
            return;
        }

        const token = (cookies as any).get("token");
        const file = image.value.files[0];

        const data = new FormData();
        data.append("name", name.value);
        data.append("description", description.value);
        data.append("origin", origin.value);
        data.append("image", file!);
        if(assignsPoints.value){
            data.append("points", `${points.value}`);
        }
        

        if(empty.value) {
            createNewProduct(data, token);
        } else {
            updateExistingProduct(data, token);
        }
    }

    defineExpose({ open });
</script>

<template>
    <dialog ref="dialog" class="modal z-0">
        <div v-if="product" class="modal-box min-w-[40dvw] z-0" ref="box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ empty ? $t("shop.prodotto.nuovo") : product.name }}</h2>
                    <img
                        v-if="!empty"
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                    <div class="grid grid-cols-2 gap-y-4 my-4 items-center" ref="form">
                        <span class="text-xl label">{{ $t("shop.nome") }}:</span>
                        <input :required="empty" class="input validator" type="text" v-model="name">

                        <span class="text-xl label">{{ $t("shop.descrizione") }}:</span>
                        <textarea :required="empty" class="validator textarea resize-none" v-model="description"></textarea>

                        <span class="text-xl label">{{ $t("shop.origine") }}:</span>
                        <input :required="empty" class="input validator" v-model="origin">

                        <div class="flex flex-col">
                            <span class="text-xl label">{{ $t("shop.punti") }}:</span>
                            <label class="label">
                                    <input type="checkbox" class="checkbox" :checked="!assignsPoints" @click="assignsPoints = !assignsPoints">
                                    {{ $t("shop.nessunPunto") }}
                            </label>
                        </div>
                        <input :required="empty" type="number" min="0" :disabled="!assignsPoints" class="input validator" v-model="points">


                        <span class="text-xl label">{{ $t("shop.immagine") }}:</span>
                        <input :required="empty" type="file" class="input file-input validator" accept="image/jpeg, image/png, image/webp" ref="image">
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
    <Alert ref="alert" />
</template>