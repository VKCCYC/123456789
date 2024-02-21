<template lang="pug">
//- 手機版
VContainer(v-if="isMobile")
  VRow
    VCol.titel(cols="12")
      h1 再次確認
    VDivider
    VCol(cols="12")
      VDataTable(:items="cart" :headers="headers")
        template(#[`item.product.image`]="{ item }")
          VImg(:src="item.product.image[0]" height="80px")
        template(#[`item.product.name`]="{ item }")
          span(v-if="item.product.sell") {{item.product.name}}
          span.text-red.text-decoration-line-through(v-else) {{ item.product.name }} (已下架)
        //- 寫他的渲染方式
        template(#[`item.quantity`]="{ item }")
          VBtn(variant="text" icon="mdi-minus" color="red" @click="addCart(item.product._id, -1)")
          | {{ item.quantity }}
          VBtn(variant="text" icon="mdi-plus" color="green" @click="addCart(item.product._id, 1)")
        template(#[`item.action`]="{ item }")
          VBtn(variant="text" icon="mdi-delete" color="red" @click="addCart(item.product._id, item.quantity * -1)")
    VCol.text-center(cols="12")
      h2.color 總金額: {{ total }}
      VBtn.cart-btn(:disabled="!canCheckout" @click="checkout" size="x-large") 結帳
//- 電腦版
VContainer.w-75(v-else)
  VRow
    VCol.titel(cols="12")
      h1 再次確認
    VDivider
    VCol(cols="12")
      VDataTable.fs(:items="cart" :headers="headers")
        template(#[`item.product.image`]="{ item }")
          VImg.img(:src="item.product.image[0]" height="100px")
        template(#[`item.product.name`]="{ item }")
          p(v-if="item.product.sell") {{item.product.name}}
          span.text-red.text-decoration-line-through(v-else) {{ item.product.name }} (已下架)
        //- 寫他的渲染方式
        template(#[`item.quantity`]="{ item }")
          VBtn(variant="text" icon="mdi-minus" color="red" @click="addCart(item.product._id, -1)")
          | {{ item.quantity }}
          VBtn(variant="text" icon="mdi-plus" color="green" @click="addCart(item.product._id, 1)")
        template(#[`item.action`]="{ item }")
          VBtn(variant="text" icon="mdi-delete" color="red" @click="addCart(item.product._id, item.quantity * -1)")
    VCol.text-center(cols="12")
      h2.color 總金額: {{ total }}
      VBtn.cart-btn(:disabled="!canCheckout" @click="checkout" size="x-large" block rounded="xl") 結帳

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

import { useDisplay } from 'vuetify'

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const user = useUserStore()
const router = useRouter()

const cart = ref([])
// 欄位是固定的
const headers = [
  { title: '商品圖片', key: 'product.image' },
  { title: '商品名稱', key: 'product.name' },
  { title: '單價', key: 'product.price' },
  { title: '數量', key: 'quantity' },
  { title: '總價', key: 'total', value: item => item.product.price * item.quantity },
  { title: '刪除', key: 'action' }
  // 還需要其他欄位自己打
]

const total = computed(() => {
  return cart.value.reduce((total, current) => {
    return total + current.quantity * current.product.price
  }, 0)
})

// 判斷能不能結帳
const canCheckout = computed(() => {
  return cart.value.length > 0 && !cart.value.some(item => !item.product.sell)
})

const addCart = async (product, quantity) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product,
      quantity
    })
    user.cart = data.result
    createSnackbar({
      text: '修改成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: '#8C8987',
        location: 'center'
      }
    })
    const idx = cart.value.findIndex(item => item.product._id === product)
    cart.value[idx].quantity += quantity
    if (cart.value[idx].quantity <= 0) {
      cart.value.splice(idx, 1)
    }
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: 'error',
        location: 'center'
      }
    })
  }
}

// 預防使用者連點結帳按鈕
const isSubmitting = ref(false)
const checkout = async () => {
  isSubmitting.value = true
  try {
    await apiAuth.post('/orders')
    user.cart = 0
    router.push('/orders')
    createSnackbar({
      text: '結帳成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: '#8C8987',
        location: 'center'
      }
    })
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: 'error',
        location: 'center'
      }
    })
  }
  isSubmitting.value = false
}

onMounted(async () => {
  try {
    const { data } = await apiAuth.get('/users/cart')
    cart.value.push(...data.result)
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: 'error',
        location: 'center'
      }
    })
  }
})

</script>

<style scoped lang="sass">
  .color
    color:#D3894D
    font-weight: bolder
    font-size: 1.5rem
  .titel
    font-size: 1.2rem
    color: #D3894D
    text-align: center
    margin-top: 2rem
    margin-bottom: 2rem
  .cart-btn
    background: #d9d5d2
    color: #403635
    margin-bottom: 5rem
    margin-top: 2rem
    font-size: 1.7rem
    font-weight: bolder
  .fs
    color:#d9d5d2
    font-weight: bolder
    font-size: 1.2rem
  .img
    margin-left: -2.2rem
  </style>
