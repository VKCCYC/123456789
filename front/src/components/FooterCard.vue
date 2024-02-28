<template lang="pug">
v-footer.vf
  v-container
    v-row
      v-col(cols="12")
        h1 出來喬

    //- v-row.justify-space-between(no-gutters)
    v-row.d-flex.align-start.flex-column.justify-space-between(no-gutters)
      v-btn.mb-2(exact v-for='(link, i) in links',
        :key='i', color='#d9d5d2',
        variant='text', rounded='xl' :to="link.to")
        | {{ link.name }}
      v-col.text-center.mt-4(cols='12')
        | {{ new Date().getFullYear() }}

</template>

<script setup>

const links = [
  { name: 'Home', to: '/' },
  { name: 'About Us', to: '/about' },
  { name: 'Team', to: '/about/product' }
]
</script>

<style scoped lang="sass">
h1
  color: #d9d5d2
  margin: 1.5rem
  margin-left: 0
.vf
  background-color: #28231F
</style>
