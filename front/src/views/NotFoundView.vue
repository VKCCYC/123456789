<template lang="pug">
//- 手機版
VContainer.h-100(v-if="isMobile")
  VRow.h-100.text-center(align="center")
    VCol(cols="12")
      h1.xs 想找啥???
    VCol(cols="12")
      VBtn.btn(to="/" :active="false") 回首頁去吧你

//- 電腦版
VContainer.h-100(v-else)
  VRow.h-100.text-center(align="center")
    VCol(cols="12")
      h1.md 想找啥???
    VCol(cols="12")
      VBtn.btn(block to="/" :active="false") 回首頁去吧你
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
</script>

<style scoped lang="sass">
.xs
  font-size: 100px
.md
  font-size: 300px
.btn
  background-color: #8C8987
  color: #28231F
  font-size: 30px
  height: 100px
</style>
