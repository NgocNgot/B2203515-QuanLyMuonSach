const BookValidation = {
  // Lấy giá trị nested từ object
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  },

  // Kiểm tra sách trùng lặp
  async checkDuplicateBook(tenSach, tacGia, currentBookId = null) {
    try {
      const response = await fetch('/api/books/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenSach: tenSach.trim(),
          tacGia: tacGia.trim(),
          currentBookId: currentBookId
        })
      });
      
      const result = await response.json();
      return result.isDuplicate;
    } catch (error) {
      console.error('Lỗi khi kiểm tra sách trùng lặp:', error);
      return false;
    }
  },

  // Validate từng field
  validateField: async function(fieldName, value, bookData = null) {
    const validators = {
             tenSach: async (value, bookData = null) => {
         const strValue = String(value || '');
         if (!strValue || strValue.trim() === '') {
           return { isValid: false, message: 'Tên sách không được để trống' };
         }
         if (strValue.length < 2) {
           return { isValid: false, message: 'Tên sách phải có ít nhất 2 ký tự' };
         }
         
         // Kiểm tra trùng lặp nếu có đủ thông tin
         if (bookData && bookData.tacGia && bookData.tacGia.trim()) {
           const isDuplicate = await BookValidation.checkDuplicateBook(
             strValue, 
             bookData.tacGia, 
             bookData._id
           );
           if (isDuplicate) {
             return { isValid: false, message: 'Sách này đã tồn tại trong hệ thống!' };
           }
         }
         
         return { isValid: true, message: '' };
       },
      loaiSach: (value) => {
        const strValue = String(value || '');
        if (!strValue || strValue.trim() === '') {
          return { isValid: false, message: 'Vui lòng chọn thể loại sách' };
        }
        return { isValid: true, message: '' };
      },
      tacGia: (value) => {
        const strValue = String(value || '');
        if (!strValue || strValue.trim() === '') {
          return { isValid: false, message: 'Tác giả không được để trống' };
        }
        if (strValue.length < 2) {
          return { isValid: false, message: 'Tên tác giả phải có ít nhất 2 ký tự' };
        }
        return { isValid: true, message: '' };
      },
      namXuatBan: (value) => {
        const strValue = String(value || '');
        if (!strValue || strValue.trim() === '') {
          return { isValid: false, message: 'Năm xuất bản không được để trống' };
        }
        const year = parseInt(strValue);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1900 || year > currentYear) {
          return { isValid: false, message: 'Năm xuất bản phải từ 1900 đến ' + currentYear };
        }
        return { isValid: true, message: '' };
      },
      donGia: (value) => {
        const strValue = String(value || '');
        if (!strValue || strValue.trim() === '') {
          return { isValid: false, message: 'Đơn giá không được để trống' };
        }
        const price = parseFloat(strValue);
        if (isNaN(price) || price <= 0) {
          return { isValid: false, message: 'Đơn giá phải là số dương' };
        }
        return { isValid: true, message: '' };
      },
      soQuyen: (value) => {
        const strValue = String(value || '');
        if (!strValue || strValue.trim() === '') {
          return { isValid: false, message: 'Số quyển không được để trống' };
        }
        const quantity = parseInt(strValue);
        if (isNaN(quantity) || quantity <= 0) {
          return { isValid: false, message: 'Số quyển phải là số nguyên dương' };
        }
        return { isValid: true, message: '' };
      },
             tenNXB: (value) => {
         const strValue = String(value || '');
         if (!strValue || strValue.trim() === '') {
           return { isValid: false, message: 'Tên nhà xuất bản không được để trống' };
         }
         if (strValue.length < 2) {
           return { isValid: false, message: 'Tên nhà xuất bản phải có ít nhất 2 ký tự' };
         }
         return { isValid: true, message: '' };
       },
       'chiTiet.hinhAnh': (value) => {
         const strValue = String(value || '');
         if (strValue && strValue.trim() !== '') {
           // URL validation regex
           const urlRegex = /^https?:\/\/.+/i;
           if (!urlRegex.test(strValue.trim())) {
             return { isValid: false, message: 'URL hình ảnh phải bắt đầu bằng http:// hoặc https://' };
           }
           
           // Check URL format
           try {
             new URL(strValue.trim());
           } catch (e) {
             return { isValid: false, message: 'URL hình ảnh không hợp lệ' };
           }
         }
         return { isValid: true, message: '' };
       },
       'chiTiet.moTa': (value) => {
         const strValue = String(value || '');
         if (strValue && strValue.trim() !== '') {
           if (strValue.length > 1000) {
             return { isValid: false, message: 'Mô tả không được vượt quá 1000 ký tự' };
           }
           if (strValue.length < 10) {
             return { isValid: false, message: 'Mô tả phải có ít nhất 10 ký tự' };
           }
         }
         return { isValid: true, message: '' };
       }
    };

    const validator = validators[fieldName];
    if (validator) {
      return await validator(value, bookData);
    }
    return { isValid: true, message: '' };
  },

  // Validate tất cả fields
  validateAll: async function(book) {
    const errors = {};
    let isValid = true;

    const fields = ['tenSach', 'loaiSach', 'tacGia', 'namXuatBan', 'donGia', 'soQuyen', 'tenNXB', 'chiTiet.hinhAnh', 'chiTiet.moTa'];
    
    for (const field of fields) {
      const value = this.getNestedValue(book, field);
      const validation = await this.validateField(field, value, book);
      
      if (!validation.isValid) {
        errors[field] = validation.message;
        isValid = false;
      }
    }

    return { isValid, errors };
  },

  // Sanitize data before submission
  sanitizeData(book) {
    return {
      tenSach: book.tenSach ? book.tenSach.trim() : '',
      loaiSach: book.loaiSach ? book.loaiSach.trim() : '',
      tacGia: book.tacGia ? book.tacGia.trim() : '',
      namXuatBan: book.namXuatBan ? String(book.namXuatBan) : '',
      donGia: book.donGia ? String(book.donGia) : '',
      soQuyen: book.soQuyen ? String(book.soQuyen) : '',
      tenNXB: book.tenNXB ? book.tenNXB.trim() : '',
      chiTiet: {
        hinhAnh: book.chiTiet?.hinhAnh ? [book.chiTiet.hinhAnh.trim()] : [],
        moTa: book.chiTiet?.moTa ? book.chiTiet.moTa.trim() : '',
      }
    };
  }
};

export default BookValidation; 