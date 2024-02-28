<template lang="pug">
v-row
  v-col(cols="12")
    h1.h1 喬一下-師傅
  //- v-divider
  //- v-carousel(hide-delimiters)
  //-   v-carousel-item(v-for="product in products" :key="product._id")
  //-     v-col.mx-auto(cols="10" )
  //-       ProductCard(v-bind="product")

  v-divider
  //- 手機版
  template.product-card(v-if="isMobile")
    v-sheet.mx-auto.w-100(color="#28231F" rounded)
      v-slide-group.pa-4(v-model="model" show-arrows)
        v-slide-group-item(
          v-for="product in products" :key="product._id"
          v-slot="{ toggle, selectedClass }"
          )
          v-card.vcardP(:class="['ma-4', selectedClass]"
            @click="toggle"
            )
            v-img(:src= "product.image[0]" @click="gogo(product._id)")

  //- 電腦版
  template.product-card(v-else)
    v-sheet.mx-auto.w-100(color="#28231F" rounded)
      v-slide-group.pa-4(v-model="model" show-arrows)
        v-slide-group-item(
          v-for="product in products" :key="product._id"
          v-slot="{ toggle, selectedClass }"
          )
          v-card.vcard(:class="['ma-4', selectedClass]"
            @click="toggle"
            )
            v-img(:src= "product.image[0]" @click="gogo(product._id)")
</template>

<script setup>
// 手機版
import { ref, onMounted, nextTick, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

import gsap from 'gsap'

const { api } = useApi()

const createSnackbar = useSnackbar()

const products = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        itemsPerPage: -1
      }
    })
    products.value.push(...data.result.data)
    await nextTick()
    gsap
      .to('.product-card', { opacity: 1, duration: 0.5, delay: 0.5 })
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})

// 幻燈片
const model = ref(null)

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 路由
const router = useRouter()

// 輪播圖
// 圖片跳轉
const gogo = (id) => {
  router.push(`/products/${id}`)
}
</script>

<style scoped lang="sass">
.product-card
  opacity: 0
.h1
  color: #d9d5d2
  font-size: 3rem

.logout-bg-color
  background: #d9d5d2
.logout-color
  color: #403635
.vcard
  height: 48vh
  width: 31rem
  // width: calc( 41vw + 0.5rem )
.vcardP
  height: 50vh
  width: 62vw
</style>
