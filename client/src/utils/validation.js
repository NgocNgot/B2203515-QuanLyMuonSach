const BookValidation = {
  // Get nested object value using dot notation (e.g., "chiTiet.hinhAnh")
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  },

  // Validate individual field
  validateField(fieldName, value) {
    const validations = {
      maSach: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[A-Z0-9]+$/
      },
      tenSach: {
        required: true,
        minLength: 2,
        maxLength: 200
      },
      loaiSach: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      tacGia: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      namXuatBan: {
        required: true,
        min: 1900,
        max: new Date().getFullYear()
      },
      donGia: {
        required: true,
        min: 0,
        pattern: /^\d+(\.\d{1,2})?$/
      },
      soQuyen: {
        required: true,
        min: 1,
        pattern: /^\d+$/
      },
      tenNXB: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      'chiTiet.hinhAnh': {
        required: false,
        pattern: /^https?:\/\/.+/
      },
      'chiTiet.moTa': {
        required: false,
        maxLength: 1000
      }
    };

    const validation = validations[fieldName];
    if (!validation) {
      return { isValid: true, message: '' };
    }

    // Check required
    if (validation.required && (!value || value.toString().trim() === '')) {
      return { isValid: false, message: 'Trường này là bắt buộc' };
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      return { isValid: true, message: '' };
    }

    const strValue = value.toString().trim();

    // Check min length
    if (validation.minLength && strValue.length < validation.minLength) {
      return { isValid: false, message: `Tối thiểu ${validation.minLength} ký tự` };
    }

    // Check max length
    if (validation.maxLength && strValue.length > validation.maxLength) {
      return { isValid: false, message: `Tối đa ${validation.maxLength} ký tự` };
    }

    // Check min value
    if (validation.min !== undefined && parseFloat(strValue) < validation.min) {
      return { isValid: false, message: `Giá trị tối thiểu là ${validation.min}` };
    }

    // Check max value
    if (validation.max !== undefined && parseFloat(strValue) > validation.max) {
      return { isValid: false, message: `Giá trị tối đa là ${validation.max}` };
    }

    // Check pattern
    if (validation.pattern && !validation.pattern.test(strValue)) {
      return { isValid: false, message: 'Định dạng không hợp lệ' };
    }

    return { isValid: true, message: '' };
  },

  // Validate all fields
  validateAll(data) {
    const errors = {};
    let isValid = true;

    const fields = [
      'maSach',
      'tenSach', 
      'loaiSach',
      'tacGia',
      'namXuatBan',
      'donGia',
      'soQuyen',
      'tenNXB',
      'chiTiet.hinhAnh',
      'chiTiet.moTa'
    ];

    fields.forEach(field => {
      const value = this.getNestedValue(data, field);
      const validation = this.validateField(field, value);
      
      if (!validation.isValid) {
        errors[field] = validation.message;
        isValid = false;
      }
    });

    return { isValid, errors };
  },

  // Sanitize data before submission
  sanitizeData(data) {
    const sanitized = { ...data };
    
    // Trim string values
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitized[key].trim();
      }
    });

    // Handle nested chiTiet object
    if (sanitized.chiTiet) {
      if (typeof sanitized.chiTiet.hinhAnh === 'string') {
        sanitized.chiTiet.hinhAnh = sanitized.chiTiet.hinhAnh.trim();
      }
      if (typeof sanitized.chiTiet.moTa === 'string') {
        sanitized.chiTiet.moTa = sanitized.chiTiet.moTa.trim();
      }
    }

    // Convert numeric fields
    if (sanitized.namXuatBan) {
      sanitized.namXuatBan = parseInt(sanitized.namXuatBan);
    }
    if (sanitized.donGia) {
      sanitized.donGia = parseFloat(sanitized.donGia);
    }
    if (sanitized.soQuyen) {
      sanitized.soQuyen = parseInt(sanitized.soQuyen);
    }

    return sanitized;
  }
};

export default BookValidation; 