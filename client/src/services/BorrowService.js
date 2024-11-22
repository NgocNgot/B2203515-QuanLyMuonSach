// services/BorrowService.js
import createApiClient from './api.service';
import axios from 'axios';

class BorrowService {
  constructor(baseURL = '/api/borrows') {
    this.api = createApiClient(baseURL);
  }

  // Tạo phiếu mượn
  async create(data) {
    // Kiểm tra nếu data không phải là một mảng thì chuyển thành mảng
    const dataToSend = Array.isArray(data) ? data : [data];

    return (await this.api.post("/create", dataToSend)).data;
  }

  // Lấy tất cả phiếu mượn
  async findAll() { 
    try { 
      return (await this.api.get("/")).data; 
    } catch (error) { 
      console.error("Lỗi khi lấy tất cả phiếu mượn:", error); 
      throw error; 
    } 
  }
  // Lấy phiếu mượn theo ID
  async findOne(id) {
    try {
      return (await this.api.get(`/${id}`)).data;
    } catch (error) {
      console.error("Lỗi khi tìm phiếu mượn::", error);
      throw error;
    }
  }

  // Cập nhật phiếu mượn
  async updateBorrow(id, data) {
    try {
      return (await this.api.put(`/update/${id}`, data)).data;
    } catch (error) {
      console.error("Lỗi khi cập nhật phiếu mượn:", error);
      throw error;
    }
  }

  // Xóa phiếu mượn
  async deleteBorrow(id) {
    try {
      return (await this.api.delete(`/delete/${id}`)).data;
    } catch (error) {
      console.error("Lỗi khi xóa phiếu mượn:", error);
      throw error;
    }
  }
  async getByUser(maDocGia) { 
    try { 
      return (await this.api.get(`/${maDocGia}`)).data; 
    } catch (error) { 
      console.error("Lỗi khi lấy thông tin độc giả:", error); 
      throw error; 
    }
  }
}

export default new BorrowService();
