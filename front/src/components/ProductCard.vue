<template lang="pug">
VContainer
  VRow
    VCol(cols="12" md="6" lg="3" v-for="product in products" :key="product._id")
      VCard.card
        template(v-if='product.image && product.image.length > 0')
          v-carousel(show-arrows='hover' hide-delimiters  progress="#403635")
            v-carousel-item(v-for='(img, index) in product.image', :key='index' )
              v-img(:src='img' height="100vh" @click='gogo(product._id)')
        VCardTitle
          RouterLink.color.text-decoration-none(:to="'/products/' +product._id") {{ product.name }}
        VCardSubtitle 一小時 ${{ product.price }}
        //- (style="white-space: pre;") 加這個才能正常顯示後端設定的換行符號
        //- VCardText(style="white-space: pre;") {{ description }}
        //- 你可以将 white-space 设置为 pre-wrap，这样可以保留文本中的换行符，
        //- 并允许文本根据需要自动换行。这样在前端显示时，文本会根据容器的宽度自动换行，
        //- 而后端添加的换行符仍然会被保留。
        VCardText.clamp-text(style="white-space: pre-wrap;") {{ product.description }}
        VCardActions
          VBtn(color="#5FA5AE" prepend-icon="mdi-clock-time-three-outline" @click="openDialog(product)") 選擇時段

      //- 123
      v-dialog.w-75(v-model="dialog" )
        v-form(:disabled="isSubmitting" @submit.prevent="submit")
          v-card
            v-card-title 選擇師傅
            v-card-text
              v-text-field(v-model="name01.value.value" variant="outlined" disabled )
              v-text-field(label="價格/1H" v-model="price01.value.value" disabled)

              v-autocomplete(v-model='friends', :disabled='isUpdating', :items='people', chips='', closable-chips='', color='blue-grey-lighten-2', item-title='names', item-value='names', label='Select', multiple='')
                template(v-slot:chip='{ products, item }')
                  v-chip(v-bind='products', :prepend-avatar='item.raw.avatar', :text='item.raw.names')
                template(v-slot:item='{ products, item }')
                  v-list-item(v-bind='products', :prepend-avatar='item.raw.avatar', :title='item.raw.names', :subtitle='item.raw.group')

              v-combobox(label="時段選擇" :items="['中午時段', '下午時段', '晚上時段']")

              v-textarea(label="備註" v-model="description01.value.value" )

              v-row
                v-col(cols="6")
                  VTextField(
                  label="時數"
                  type="text"
                  inputmode="numeric"
                  min="0" v-model="quantity.value.value"
                  :error-messages="quantity.errorMessage.value"
                  clearable)

                v-col(cols="6")
                  v-text-field(type="date" )

            v-card-actions
              v-spacer
              v-btn(color="red" :disabled="isSubmitting" @click="closeDialog") 取消
              v-btn(color="green" type="submit" :loading="isSubmitting" @click="addCart") 送出
</template>

<script setup>
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/store/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

import { ref, onMounted, nextTick } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'

const { api, apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

const quantity = useField('quantity')

const products = ref([])
const product = ref([])

// 圖片跳轉
const gogo = (id) => {
  router.push(`/products/${id}`)
}

const addCart = async () => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  try {
    console.log(product.value._id)
    const { data } = await apiAuth.patch('/users/cart', {
      product: product.value._id,
      quantity: quantity.value.value
    })
    user.cart = data.result
    createSnackbar({
      text: '新增成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: '#8C8987',
        location: 'center'
      }
    })
    closeDialog()
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
}

// 表單對話框的開啟狀態
const dialog = ref(false)

const openDialog = async (item) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  dialog.value = true
  product.value.name = item.name
  product.value.price = item.price
  product.value._id = item._id
  // product.value.image = item.image
  // product.value.description = item.description
  await nextTick()
  console.log(item.name)
  console.log(product.value.name)
  resetForm({
    values: {
      name: product.value.name,
      price: product.value.price,
      quantity: { value: 1 }
    }
  })
}

// 關閉對話框
const closeDialog = () => {
  dialog.value = false
  resetForm()
}

// 分類

const schema = yup.object({
  quantity: yup.number().typeError('格式錯誤').required('缺少數量').min(1, '數量最少為 1'),
  name: yup.string().required('缺少師傅姓名')
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    quantity: { value: 1 },
    description: ''
  }
})

const name01 = useField('name')
const price01 = useField('price')
const description01 = useField('description')

const submit = handleSubmit(async (values) => {
  try {
    createSnackbar({
      text: '新增成功',
      // 不要出現關閉的按鈕
      showCloseButton: false,
      // 要傳進 snackbarProps 元件的參數
      snackbarProps: {
        // 1.5 秒鐘後消失
        timeout: 1500,
        // 顏色
        color: '#8C8987',
        // 出現在螢幕中間
        location: 'center'
      }
    })

    closeDialog()
  } catch (error) {
    console.log(error)

    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      // 不要出現關閉的按鈕
      showCloseButton: false,
      // 要傳進 snackbarProps 元件的參數
      snackbarProps: {
        // 1.5 秒鐘後消失
        timeout: 1500,
        // 顏色
        color: 'error',
        // 出現在螢幕中間
        location: 'center'
      }
    })
  }
})

const friends = ref()
const isUpdating = ref(false)
// const names = ref('')
const people = ref([
  { names: ' 頭 ' },
  { names: ' 頸 ' },
  { names: ' 肩 ' },
  { names: ' 背 ' },
  { names: ' 手 ' },
  { names: ' 臀 ' },
  { names: ' 腿 ' },
  { names: ' 腳底 ' },
  { names: ' 上半身 ' },
  { names: ' 下半身 ' },
  { names: ' 全身 ' }
])

onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        itemsPerPage: -1
      }
    })
    products.value.push(...data.result.data) // 推進陣列
    await nextTick() // 等待網頁重新渲染(要跑v-for)
    console.log(products.value)
    return product
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
</script>

<style scoped lang="sass">
.color
  color: #36E8FF
.card
  background: #595552
  color: #D9D5D2
.clamp-text
  display: -webkit-box
  -webkit-box-orient: vertical
  overflow: hidden
  /* 设置行数 */
  -webkit-line-clamp: 3
  line-height: 1.5
</style>
