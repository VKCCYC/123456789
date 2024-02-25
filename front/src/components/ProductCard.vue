<template lang="pug">
VCard.card
  template(v-if='props.image && props.image.length > 0')
    v-carousel(show-arrows='hover' hide-delimiters  progress="#403635")
      v-carousel-item(v-for='(img, index) in props.image', :key='index' )
        v-img(:src='img' height="100vh" @click='gogo(_id)')
  VCardTitle
    RouterLink.color.text-decoration-none(:to="'/products/' +_id") {{ name }}
  VCardSubtitle 一小時 ${{ price }}
  //- (style="white-space: pre;") 加這個才能正常顯示後端設定的換行符號
  VCardText(style="white-space: pre;") {{ description }}
  VCardActions
    VBtn(color="#5FA5AE" prepend-icon="mdi-clock-time-three-outline" @click="openDialog()") 選擇時段

//- 123
v-dialog.w-75(v-model="dialog" )
  v-form(:disabled="isSubmitting" @submit.prevent="submit")
    v-card
      v-card-title 選擇師傅
      v-card-text
        v-text-field(v-model="name01.value.value" variant="outlined" disabled )
        v-text-field(label="價格/1H" v-model="price01.value.value" disabled)

        v-autocomplete(v-model='friends', :disabled='isUpdating', :items='people', chips='', closable-chips='', color='blue-grey-lighten-2', item-title='names', item-value='names', label='Select', multiple='')
            template(v-slot:chip='{ props, item }')
              v-chip(v-bind='props', :prepend-avatar='item.raw.avatar', :text='item.raw.names')
            template(v-slot:item='{ props, item }')
              v-list-item(v-bind='props', :prepend-avatar='item.raw.avatar', :title='item.raw.names', :subtitle='item.raw.group')

        v-combobox(label="時段選擇" :items="['中午時段', '下午時段', '晚上時段']")

        v-textarea(label="備註" v-model="description01.value.value" )
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

import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'

const { apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

// defineProps 這個元件有哪些可以接收的資料
const props = defineProps([
  '_id',
  'category',
  'description',
  'image',
  'name',
  'price',
  'sell'
])

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
    const { data } = await apiAuth.patch('/users/cart', {
      product: props._id,
      quantity: 1
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

const openDialog = () => {
  dialog.value = true
}

// 關閉對話框
const closeDialog = () => {
  dialog.value = false
  resetForm()
}

// 分類

const schema = yup.object({
  name: yup.string().required('缺少師傅姓名')
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.name,
    price: props.price,
    description: '',
    category: '',
    sell: false
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

const autoUpdate = ref(true)
const friends = ref()
const isUpdating = ref(false)
const names = ref('')
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
</script>

<style scoped lang="sass">
.color
  color: #36E8FF
.card
  background: #595552
  color: #D9D5D2
</style>
