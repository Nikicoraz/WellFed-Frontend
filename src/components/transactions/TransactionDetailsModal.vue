<script setup lang="ts">
    import { ref, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();

    const props = defineProps(['open', 'transaction']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return
        }

        if (open) {
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    });
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div v-if="transaction" class="modal-box">
            <div class="bg-white text-black flex flex-col">
                <div>{{ props.transaction.transactionType }}</div>
                <div>{{ props.transaction.transactionStatus }}</div>
                <div>{{ props.transaction.points}}</div>
                <div>
                    <ul v-if="props.transaction.items.products">
                        <p>Prodotti coinvolti</p>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="product in props.transaction.items.products">
                                        <td>{{ product.name }}</td>
                                        <td>{{ product.quantity }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ul>
                    <ul v-if="props.transaction.items.prizes">
                        <p>Premi coinvolti</p>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="prize in props.transaction.items.prizes">
                                        <td>{{ prize.name }}</td>
                                        <td>{{ prize.quantity }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li v-for="item in props.transaction.items.products"></li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
</template>