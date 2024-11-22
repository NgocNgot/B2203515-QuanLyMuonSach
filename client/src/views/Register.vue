<template>
  <div class="register-main">
    <div class="main">
      <div class="img-icon">
        <img src="../assets/img/img_icon.png" alt="img_icon" />
      </div>
      <div class="form">
        <form class="register" @submit.prevent="register">
          <div class="title">ĐĂNG KÝ</div>
          <div class="content">
            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <label for="hoLot">Họ lót:</label>
                  <input type="text" id="hoLot" v-model="hoLot" placeholder="VD: Nguyễn Thị" />
                  <p v-if="errors.hoLot">{{ errors.hoLot }}</p>
                </div>
                <div class="col-sm">
                  <label for="ten">Tên:</label>
                  <input type="text" id="ten" v-model="ten" placeholder="VD: Bích Ngọc" />
                  <p v-if="errors.ten">{{ errors.ten }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <label for="ngaySinh">Ngày sinh:</label>
                  <input type="date" id="ngaySinh" v-model="ngaySinh" />
                  <p v-if="errors.ngaySinh">{{ errors.ngaySinh }}</p>
                </div>
                <div class="col-sm">
                  <label for="phai">Phái:</label>
                  <select id="phai" v-model="phai">
                    <option value="">Chọn phái của bạn</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <p v-if="errors.phai">{{ errors.phai }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <label for="diaChi">Địa chỉ:</label>
                  <input type="text" id="diaChi" v-model="diaChi" />
                  <p v-if="errors.diaChi">{{ errors.diaChi }}</p>
                </div>
                <div class="col-sm">
                  <label for="dienThoai">Số điện thoại:</label>
                  <input type="text" id="dienThoai" v-model="dienThoai" maxlength="10" />
                  <p v-if="errors.dienThoai">{{ errors.dienThoai }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <label for="email">Email:</label>
                  <input type="email" id="email" v-model="email" placeholder="Nhập vào email của bạn" />
                  <p v-if="errors.email">{{ errors.email }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <label for="password">Mật khẩu:</label>
                  <input type="password" id="password" v-model="password" placeholder="Nhập mật khẩu" />
                  <p v-if="errors.password">{{ errors.password }}</p>
                </div>
                <div class="col-sm">
                  <label for="password-confirmation">Nhập lại mật khẩu:</label>
                  <input type="password" id="password-confirmation" v-model="passwordconfirm" placeholder="Nhập lại mật khẩu" />
                  <p v-if="errors.passwordconfirm">{{ errors.passwordconfirm }}</p>
                </div>
              </div>
              <button type="submit">Đăng ký</button>
              <div class="bottom">
                Bạn đã có tài khoản? <RouterLink to="/login" style="text-decoration: none; color: #FBA3CD;"> Đăng nhập tại đây</RouterLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UsersService from "@/services/UserService";

export default {
  name: "Register",
  data() {
    return {
      hoLot: "",
      ten: "",
      ngaySinh: "",
      phai: "",
      email: "",
      dienThoai: "",
      password: "",
      passwordconfirm: "",
      diaChi: "",
      errors: {},
    };
  },

  methods: {
    register() {
      //In dữ liệu đk ra để kiểm tra
      console.log("Dữ liệu đăng ký:", {
        hoLot: this.hoLot,
        ten: this.ten,
        ngaySinh: this.ngaySinh,
        phai: this.phai,
        diaChi: this.diaChi,
        dienThoai: this.dienThoai,
        email: this.email,
        password: this.password,
      });

      this.runValidations()
        .then((isValid) => {
          if (isValid) {
            const newUser = {
              hoLot: this.hoLot,
              ten: this.ten,
              ngaySinh: this.ngaySinh,
              phai: this.phai,
              diaChi: this.diaChi,
              dienThoai: this.dienThoai,
              email: this.email,
              password: this.password,
            };

            console.log("Dữ liệu người dùng:", newUser);

            UsersService.createUser(newUser)
              .then(() => {
                alert("Đăng ký tài khoản thành công.");
                this.$router.push("/login");
              })
              .catch((error) => {
                alert("Đăng ký tài khoản thất bại!");
                console.error("Lỗi khi tạo tài khoản:", error);
              });
          }
        })
        .catch((err) => {
          console.error("Lỗi trong quá trình kiểm tra:", err);
          this.errors.message = "Lỗi không xác định trong quá trình đăng ký!";
        });
    },

    async runValidations() {
      try {
        this.errors = {};
        const emailValid = this.ValidateEmail();
        const passwordValid = this.ValidatePassword();
        const passConfirmValid = this.ValidatePassConfirm();
        const otherFieldsValid = this.ValidateOtherFields();
        return emailValid && passwordValid && passConfirmValid && otherFieldsValid;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    ValidateEmail() {
      var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (this.email === "") {
        this.errors.email = "Vui lòng nhập email";
        return false;
      } else if (!this.email.match(validRegex)) {
        this.errors.email = "Vui lòng nhập đúng định dạng email";
        return false;
      }
      this.errors.email = "";
      return true;
    },

    ValidatePassword() {
      if (this.password === "") {
        this.errors.password = "Vui lòng nhập mật khẩu";
        return false;
      } else if (this.password.length < 6) {
        this.errors.password = "Mật khẩu tối thiểu 6 ký tự";
        return false;
      }
      this.errors.password = "";
      return true;
    },

    ValidatePassConfirm() {
      if (this.passwordconfirm === "") {
        this.errors.passwordconfirm = "Vui lòng nhập lại mật khẩu";
        return false;
      } else if (this.passwordconfirm !== this.password) {
        this.errors.passwordconfirm = "Mật khẩu nhập lại không trùng khớp";
        return false;
      }
      this.errors.passwordconfirm = "";
      return true;
    },

    ValidateOtherFields() {
      let isValid = true;
      if (this.hoLot === "") {
        this.errors.hoLot = "Vui lòng nhập họ lót";
        isValid = false;
      }
      if (this.ten === "") {
        this.errors.ten = "Vui lòng nhập tên";
        isValid = false;
      }
      if (this.ngaySinh === "") {
        this.errors.ngaySinh = "Vui lòng nhập ngày sinh";
        isValid = false;
      }
      if (this.phai === "") {
        this.errors.phai = "Vui lòng chọn phái";
        isValid = false;
      }
      if (this.diaChi === "") {
        this.errors.diaChi = "Vui lòng nhập địa chỉ";
        isValid = false;
      }
      if (this.dienThoai === "") {
        this.errors.dienThoai = "Vui lòng nhập số điện thoại";
        isValid = false;
      } else if (!this.dienThoai.match(/^[0-9]{10}$/)) {
        this.errors.dienThoai = "Số điện thoại không hợp lệ";
        isValid = false;
      }
      return isValid;
    },
  },
};
</script>

<style scoped>
.register-main {
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
p {
  color: #FBA3CD;
  margin-bottom: 4px;
}
.container {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  margin-bottom: 8px;
}

.col-sm {
  flex: 1;
  margin-right: 0px;
}

.col-sm:last-child {
  margin-right: 0;
}

label {
  display: block;
  margin-bottom: 2px;
  color: #000;
}

input, select {
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
  background: #FFDCE2;
  color: #225771;
}
.bottom {
  text-align: center;
  font-size: 13px;
}

</style>