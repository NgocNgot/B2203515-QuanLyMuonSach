import createApiClient from "./api.service";

class NXBService {
    constructor(baseURL = "/api/nxbs") {
        this.api = createApiClient(baseURL);
    }

    // Lấy danh sách tất cả nhà xuất bản
    async getAll() {
        return await this.api.get("/");
    }

    // Lấy thông tin nhà xuất bản cụ thể theo ID
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    // Tạo mới một nhà xuất bản
    async create(data) {
        return (await this.api.post("/create", data)).data;
    }

    // Cập nhật thông tin nhà xuất bản
    async update(id, data) {
        return (await this.api.put(`/update/${id}`, data)).data;
    }

    // Xóa nhà xuất bản
    async delete(id) {
        return (await this.api.delete(`/delete/${id}`)).data;
    }
}

export default new NXBService();
