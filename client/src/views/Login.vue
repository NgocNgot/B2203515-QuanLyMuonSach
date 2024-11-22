<template>
  <div class="login-main">
    <div class="main">
      <div class="img-icon">
        <img src="../assets/img/img_icon.png" alt="img_icon"/>
      </div>
      <div class="form" @submit.prevent="checkForm">
        <form class="login">
          <div class="title">ĐĂNG NHẬP</div>
          <div class="content">
            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <label for="email">Email:</label>
                  <input type="email" id="email" v-model="email" placeholder="Nhập vào email của bạn" required>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <label for="password">Mật khẩu:</label>
                  <input type="password" id="password" v-model="password" placeholder="Nhập vào mật khẩu của bạn" required>
                </div>
              </div>

              <button type="submit">Đăng nhập</button>
              <p v-if="errorMessage" class="error" style="color: #FBA3CD;">{{ errorMessage }}</p>
              <div class="bottom">
                Bạn chưa có tài khoản? <RouterLink to="/register" style="text-decoration: none; color: #FBA3CD;"> Đăng ký tại đây</RouterLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';
import { RouterLink } from 'vue-router';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
    };
  },
  methods: {
    async checkForm() {
      try {
        const response = await UserService.api.post("/login", {
          email: this.email,
          password: this.password,
        });

        if (response.data) {
          // Lưu thông tin người dùng vào localStorage với đúng định dạng
          localStorage.setItem("user", JSON.stringify({ data: response.data.user }));

          // Điều hướng đến trang tương ứng
          if (response.data.redirectTo === "/admins") {
            this.$router.push("/admins"); // Đối với nhân viên (admin)
          } else {
            this.$router.push("/"); // Đối với độc giả
          }
        } else {
          this.errorMessage = "Email hoặc mật khẩu không đúng.";
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu đăng nhập: ", error);
        this.errorMessage = "Đã xảy ra lỗi trong quá trình đăng nhập!";
      }
    },
  },
};
</script>

<style scoped>
.login-main {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  font-family: Roboto, sans-serif;
  background: #F3FBFF;
}

.main {
  margin: 20px auto;
  width: 60%;
  background: #CAEBFA;
  border-radius: 10px;
  padding: 20px;
}
.form {
  background: #fff;
  border-radius: 10px;
  padding: 10px 32px;
  margin: 0px 40px 8px 40px;
}
.img-icon {
  display: flex;
  justify-content: center;
}
.img-icon img {
  width: 120px;
  height: auto;
  padding-bottom: 4px;

}
.title {
  color: #000;
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.container {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  margin-bottom: 8px;
}


label {
  display: block;
  margin-bottom: 2px;
  color: #000;
}

input {
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: #F1F1F1;
  border-radius: 5px;
  border: none;
}

button {
  width: 100%;
  padding: 10px;
  margin: 12px auto;
  background: #225771;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
}

button:hover {
  background: #1d4c68;
}
.bottom {
  text-align: center;
  font-size: 13px;
}

</style>
