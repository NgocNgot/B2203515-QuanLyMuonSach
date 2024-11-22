<template>
  <div class="manage-nxb">
    <div class="content">
      <h1>Quản lý nhà xuất bản</h1>
      <div class="section-line"></div>
      <button class="add-nxb" @click="showAddNXBModal">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Thêm nhà xuất bản mới
      </button>
      <table>
        <thead>
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nxb in nxbs" :key="nxb._id">
            <td>{{ nxb.maNXB }}</td>
            <td>{{ nxb.tenNXB }}</td>
            <td>{{ nxb.diaChi }}</td>
            <td>
              <button @click="showEditNXBModal(nxb)">
                <font-awesome-icon :icon="['fas', 'pen']" style="color: #225771;" />
              </button>
              <button @click="deleteNXB(nxb._id)">
                <font-awesome-icon :icon="['fas', 'eraser']" style="color: #FBA3CD;" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm/sửa Nhà xuất bản -->
    <div v-if="isModalOpen" class="modal form">
      <div class="modal-content container">
        <p class="title">{{ modalType === 'add' ? 'Thêm Nhà xuất bản' : 'Sửa Nhà xuất bản' }}</p>
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-sm">
              <label for="tenNXB">Tên nhà xuất bản:</label>
              <input v-model="currentNXB.tenNXB" type="text" id="tenNXB" required />
            </div>
            <div class="col-sm">
              <label for="diaChi">Địa chỉ:</label>
              <input v-model="currentNXB.diaChi" type="text" id="diaChi" required />
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <button type="submit">Lưu</button>
              <button type="button" @click="closeModal">Hủy</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NXBService from "@/services/NXBService";

export default {
  data() {
    return {
      nxbs: [],
      isModalOpen: false,
      modalType: "add", // 'add' hoặc 'edit'
      currentNXB: {
        maNXB: "",
        tenNXB: "",
        diaChi: "",
      },
    };
  },
  methods: {
    async fetchNXBs() {
      try {
        const response = await NXBService.getAll();
        this.nxbs = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách NXB:", error);
      }
    },
    showAddNXBModal() {
      this.modalType = "add";
      this.resetCurrentNXB();
      this.isModalOpen = true;
    },
    showEditNXBModal(nxb) {
      this.modalType = "edit";
      this.currentNXB = { ...nxb };
      this.isModalOpen = true;
    },
    async handleSubmit() {
      try {
        if (this.modalType === "add") {
          await NXBService.create(this.currentNXB);
          alert("Thêm Nhà xuất bản thành công!");
        } else {
          await NXBService.update(this.currentNXB._id, this.currentNXB);
          alert("Sửa Nhà xuất bản thành công!");
        }
        this.closeModal();
        this.fetchNXBs();
      } catch (error) {
        console.error("Lỗi khi lưu NXB:", error);
        alert("Có lỗi khi lưu Nhà xuất bản!");
      }
    },
    async deleteNXB(id) {
      if (confirm("Bạn có chắc chắn muốn xóa Nhà xuất bản này?")) {
        try {
          await NXBService.delete(id);
          alert("Xóa Nhà xuất bản thành công!");
          this.fetchNXBs();
        } catch (error) {
          console.error("Lỗi khi xóa Nhà xuất bản:", error);
        }
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetCurrentNXB();
    },
    resetCurrentNXB() {
      this.currentNXB = {
        maNXB: "",
        tenNXB: "",
        diaChi: "",
      };
    },
  },
  mounted() {
    this.fetchNXBs();
  },
};
</script>

<style scoped>
.manage-nxb {
  display: flex;
  font-size: 14px;
}
.content h1 {
  color: #225771;
  font-weight: bold;
}
.add-nxb {
  margin-top: 12px;
  font-size: 16px;
  color: #ffff;
  border-radius: 5px;
  background-color: #225771;
  padding: 4px 16px;
}
.add-nxb:hover {
  color: #225771;
  background-color: #FFDCE2;
}
.section-line {
  flex-grow: 1;
  height: 2px;
  background-color: #225771;
}

.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
}
.content {
  flex: 1;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table th,
table td {
  border: 1px solid #225771;
  padding: 8px;
  text-align: left;
}
table th {
  background-color: #CAEBFA;
  white-space: nowrap;
  font-weight: bold;

}
table th:nth-child(2),
table td:nth-child(2) {
  width: 25%; 
}
/* Căn chỉnh khoảng cách giữa các nút trong cột cuối */
table td:last-child button {
  margin-right: 8px;
}
table td:last-child button:last-of-type {
  margin-right: 0;
}
/*Định dạng form chức năng thêm/sửa sách */
.modal {
  position: fixed;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  background-color: white;
  padding: 8px 40px;
  border-radius: 10px;
  width: 60%;
}
.title {
  color: #225771;
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
}
.row {
  display: flex;
  margin-bottom: 8px;
}

.col-sm {
  flex: 1;
  margin-right: 8px;
}

.col-sm:last-child {
  margin-right: 0;
}

.modal-content label {
  display: block;
  margin-bottom: 2px;
  color: #000;
}

.modal-content input, select {
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: #F1F1F1;
  border-radius: 5px;
  border: none;
}

.col-sm button {
  width: 100px;
  height: 40px;
  padding: 8px;
  background: #225771;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-top: 26px;
  margin-right: 8px;
  cursor: pointer;
}
.col-sm button:hover {
  background: #FFDCE2;
  color: #225771;
}


</style>
