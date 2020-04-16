<template>
  <a-form id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit">
    <a-form-item>
      <a-input v-decorator="['userName',{ rules: [{ required: true, message: '请输入用户名' }] },]"
               placeholder="Username">
        <a-icon slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-decorator="[
          'userPwd',
          { rules: [{ required: true, message: '请输入密码' }] },]"
               type="userPwd"
               placeholder="请输入密码">
        <a-icon slot="prefix"
                type="lock"
                style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a class="login-form-forgot"
         href="">
        忘记密码
      </a>
      <a-button type="primary"
                html-type="submit"
                class="login-form-button">
        登录
      </a-button>
      或者
      <a href="">
        注册
      </a>
    </a-form-item>
  </a-form>
</template>

<script>

//api
import { login } from '../../api/user/user';

export default {
  name: 'Login',
  data () {
    return {
      test: 't'
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      name: 'normal_login'
    })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let res = (await login(values)).data
          console.log(res);
          if (res.status === "20000") {
            this.$router.push({ path: '/camera' });
          }
        }
      })
    },
  }
}
</script>
<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
  float: right;
}

#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>