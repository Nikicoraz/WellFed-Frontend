<template>
    <div
        class="bg-base-100 card card-border shadow rounded-xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
    >
        <div class="card-body">
            <figure>
                <div class="aspect-square overflow-hidden rounded-xl">
                    <img
                        class="w-full h-full object-cover"
                        src="../../assets/plus.svg"
                        :alt="$t('shop.premio.nuovo')"
                    />
                </div>
            </figure>
            <div class="flex justify-between mt-6">
                <div class="flex">
                    <h1 class="text-2xl card-title">{{ $t("shop.premio.nuovo") }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>