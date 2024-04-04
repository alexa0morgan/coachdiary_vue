<script setup lang="ts">
defineProps<{
  src: string;
  mirrored?: boolean;
}>()
</script>

<template>
  <div class="container" :class="{mirrored}">
    <div class=" img-border rounded-xl">
      <v-img class="img rounded-xl" :src alt="" cover />
    </div>
    <p class="text">
      <slot />
    </p>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: auto 1fr;
  margin: 40px 50px;
  align-items: center;
  gap: 120px;
}

.mirrored {
  grid-template-columns: 1fr auto;
}

.mirrored .img-border {
  order: 1;
}

.mirrored .text {
  text-align: left;
}

.img-border {
  border: 3px solid #f2df73;
  padding: 0 10px;
  height: 450px;
  aspect-ratio: 0.75;
}

.img {
  height: 100%;
}

.text {
  text-align: right;
  font-size: 24px;
}

@media (max-width: 1200px) {
  .text {
    font-size: 22px;
  }

  .container {
    gap: 50px
  }
}

@media (max-width: 950px) {

  .container {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }

  .mirrored .img-border, .img-border {
    width: 100%;
    aspect-ratio: auto;
    order: 0;
    height: 200px;
  }

  .text {
    text-align: left;
    font-size: 20px;
  }
}

</style>