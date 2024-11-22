<template>
    <div class="container" text-center>
        <div class="row">
          <div class="col">
            <div class="vstack gap">
                <img src="../assets/img/logo.png" style="width: 200px; height: auto; justify-content: center; margin-top: 20px;"/>
            </div>
            <p class="content">
                BookWise là hệ thống hỗ trợ quản lý mượn sách cho thư viện, giúp nâng cao hiệu quả hoạt động và trải nghiệm người dùng.
            </p>
          </div>


          <div class="col">
            <p class="tilte">VỀ CHÚNG TÔI</p>
            <div class="vstack gap">
                <a><RouterLink to="/">Câu chuyện thương hiệu</RouterLink></a>
                <a href="#">Điều khoản và điều kiện</a>
                <a href="#">Liên hệ</a>
                <a href="#">Tin tức</a>
                <p>Hotline: 0346786471</p>
                <p>Email: nbichngoc3904@gmail.com</p>
            </div>
          </div>

          <div class="col">
            <p class="tilte">HỖ TRỢ VÀ BẢO MẬT</p>
            <div class="vstack gap">
                <a href="#">Chính sách bảo mật</a>
                <a href="#">Hướng dẫn đặt sách</a>
            </div>
          </div>

          <div class="col">
            <p class="tilte">TÀI KHOẢN CỦA TÔI</p>
            <div class="vstack gap">
                <a href="#">Đăng ký tài khoản</a>
                <a href="#">Chi tiết tài khoản</a>
                <a href="#">Lịch sử mượn sách</a>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12" style="background-color: #225771; height: 40px;">
                <p class="bottom">Bản quyền thuộc về BookWise.</p>
            </div>
        </div>
      </div>
</template>

<style scoped>
    /* Reset các phần tử để đảm bảo hiển thị đồng nhất trên các trình duyệt */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Tổng thể trang web */
.container {
    width: 100%;
    align-items: center;
    background-color: #CEE6F2;
    font-family: 'Jost', sans-serif;
}


a{
    color: #212425;
    margin-bottom: 4px;
}
.tilte{
    margin: 24px 0px;
    font-size: 1.2em;
    font-weight: bold;
    color: #225771;
}
.bottom{
    justify-content: center;
    text-align: center;
    margin: 8px auto;
    color: #fff;
}

@media (max-width: 768px) {
  .navbar-brand {
    width: 90px;
    height: 30px;
  }
}
</style>