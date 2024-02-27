<template lang="pug">
v-carousel.bg-color(hide-delimiters height="calc(100vh - 64px)" cycle interval= 3000 show-arrows="hover")
  v-carousel-item(v-for='(item,i) in items', :key='i', :src='item.src' )

v-container

  v-banner(bg-color="#28231F" color="#D3894D" icon='mdi-newspaper-variant-outline' border="none")
    template(v-slot:prepend)
      v-avatar
    v-banner-text(style="font-size: 1.5rem;") NEWS &nbsp;
      span(style="font-size: 1rem;") &nbsp; 2024/03 活動公告 ~ &nbsp; 儲值 20000 送 2000

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
    template(v-if="isMobile")
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

    template(v-else)
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

RoomView
FooterCard

</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'
// 手機版
import { useDisplay } from 'vuetify'

// import ProductCard from '@/components/ProductCard.vue'
import RoomView from '@/components/RoomView.vue'
import FooterCard from '@/components/FooterCard.vue'

import gsap from 'gsap'

const { api } = useApi()

const createSnackbar = useSnackbar()

const products = ref([])

const router = useRouter()

// 幻燈片
const model = ref(null)

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

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

// 輪播圖
// 圖片跳轉
const gogo = (id) => {
  router.push(`/products/${id}`)
}

// reactive 函数接收一个普通的 JavaScript 对象（或数组），
// 并返回一个代理对象，该代理对象会在访问和修改数据时跟踪依赖关系。
// 这意味着如果你修改了代理对象中的属性或数组元素，相关的界面部分将会自动更新。
const items = reactive([
  {
    src: new URL('@/assets/zombie.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/Kenmochi-Toya01.jpg', import.meta.url).href
  },
  {
    src: new URL('@/assets/kuzuha04.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/aym.jpg', import.meta.url).href
  }
])
</script>

<style scoped lang="sass">
.product-card
  opacity: 0
.h1
  color: #d9d5d2
  font-size: 3rem
.bg-color
  background: white
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
