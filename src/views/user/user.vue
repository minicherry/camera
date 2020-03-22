<template>
  <div id="app">
    <a-button type="primary">hello world</a-button>

    ooooo </div>

</template>
<script>
// api
import userList from '../../api/user/user'

export default {
  name: 'User',
  components: {
  },
    data(){
    return{}
  },
  created(){
      this.getUserList()
  },
  methods:{
      getUserList() {
        userList()
     }
  }
}
</script>

<style>
</style>
