/**
 * Tiện ích làm sạch dữ liệu (Sanitize) và kiểm tra tính hợp lệ (Validation)
 */

// Ký tự nguy hiểm thường gặp trong tấn công XSS / HTML Injection / Script
const DANGEROUS_CHARS_REGEX = /[<>'"`\\/={}[\];]/;

/**
 * Làm sạch chuỗi cơ bản: trim khoảng trắng đầu cuối, gộp nhiều khoảng trắng liên tiếp
 */
export function sanitizeText(val) {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/\s+/g, ' ');
}

/**
 * Làm sạch username / email: loại bỏ hoàn toàn khoảng trắng
 */
export function sanitizeUsername(val) {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/\s+/g, '');
}

/**
 * Kiểm tra chuỗi có chứa ký tự độc hại / bất thường không
 */
export function containsDangerousChars(val) {
  if (!val) return false;
  return DANGEROUS_CHARS_REGEX.test(val);
}

/**
 * Validate Họ và tên (Full Name)
 * - Độ dài: 2 - 50 ký tự
 * - Chỉ cho phép chữ cái (hỗ trợ tiếng Việt có dấu), khoảng trắng, dấu gạch ngang
 * - Không cho phép số, ký tự đặc biệt, thẻ HTML
 */
export function validateName(val) {
  const clean = sanitizeText(val);
  if (!clean) return 'Vui lòng nhập họ và tên.';
  if (clean.length < 2) return 'Họ và tên tối thiểu 2 ký tự.';
  if (clean.length > 50) return 'Họ và tên tối đa 50 ký tự.';
  
  // Kiểm tra chỉ gồm chữ cái tiếng Việt / quốc tế và khoảng trắng
  const nameRegex = /^[\p{L}\s'-]+$/u;
  if (!nameRegex.test(clean)) {
    return 'Họ tên không được chứa số hoặc ký tự đặc biệt bất thường.';
  }
  return '';
}

/**
 * Validate Email
 * - Độ dài: 5 - 100 ký tự
 * - Định dạng email hợp lệ
 * - Không chứa ký tự lạ
 */
export function validateEmail(val) {
  const clean = sanitizeUsername(val);
  if (!clean) return 'Vui lòng nhập email.';
  if (clean.length < 5) return 'Email quá ngắn (tối thiểu 5 ký tự).';
  if (clean.length > 100) return 'Email tối đa 100 ký tự.';
  if (containsDangerousChars(clean)) {
    return 'Email chứa ký tự bất thường không được phép.';
  }

  // Regex email chuẩn RFC
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return 'Định dạng email không hợp lệ (ví dụ: user@domain.com).';
  }
  return '';
}

/**
 * Validate Username (cho phép cả username thường hoặc email)
 * - Nếu có chứa @: kiểm tra theo chuẩn email (tối đa 100 ký tự)
 * - Nếu là username thường:
 *   + Độ dài: 3 - 30 ký tự
 *   + Chỉ cho phép: a-z, A-Z, 0-9, dấu gạch dưới _, gạch ngang -, dấu chấm .
 */
export function validateUsername(val) {
  const clean = sanitizeUsername(val);
  if (!clean) return 'Vui lòng nhập Username hoặc Email.';

  if (clean.includes('@')) {
    return validateEmail(clean);
  }

  if (clean.length < 3) return 'Username tối thiểu 3 ký tự.';
  if (clean.length > 30) return 'Username tối đa 30 ký tự.';
  
  // Chỉ chấp nhận chữ, số, dấu gạch dưới, gạch ngang, dấu chấm
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!usernameRegex.test(clean)) {
    return 'Username chỉ được dùng chữ cái, số, dấu gạch (- _ .), không chứa ký tự đặc biệt.';
  }
  return '';
}

/**
 * Validate Mật khẩu (Password)
 * - Độ dài: 6 - 64 ký tự
 * - Không chứa khoảng trắng hoặc ký tự điều khiển
 */
export function validatePassword(val) {
  if (!val) return 'Vui lòng nhập mật khẩu.';
  if (val.length < 6) return 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.';
  if (val.length > 64) return 'Mật khẩu tối đa 64 ký tự.';
  if (/\s/.test(val)) return 'Mật khẩu không được chứa khoảng trắng.';
  return '';
}

/**
 * Validate Xác nhận Mật khẩu (Confirm Password)
 */
export function validateConfirmPassword(val, originalPassword) {
  if (!val) return 'Vui lòng xác nhận lại mật khẩu.';
  if (val !== originalPassword) {
    return 'Mật khẩu xác nhận không khớp!';
  }
  return '';
}

// Ký tự được phép trong tên kỹ năng: chữ, số và các ký hiệu thường gặp của tên công nghệ
const SKILL_NAME_REGEX = /^[\p{L}\p{N}\s+#./&()-]+$/u;

// Ký tự được phép trong tên danh mục kỹ năng
const CATEGORY_NAME_REGEX = /^[\p{L}\p{N}\s&+./-]+$/u;

/**
 * Validate tên kỹ năng (Skill)
 * - Độ dài: 1 - 40 ký tự
 * - Cho phép: C#, Node.js, React Native, CI/CD, Tối ưu truy vấn SQL
 */
export function validateSkillName(val) {
  const clean = sanitizeText(val);
  if (!clean) return 'Vui lòng nhập tên kỹ năng.';
  if (clean.length > 40) return 'Tên kỹ năng tối đa 40 ký tự.';
  if (!SKILL_NAME_REGEX.test(clean)) {
    return 'Tên kỹ năng chứa ký tự không được phép.';
  }
  return '';
}

/**
 * Validate tên danh mục kỹ năng (Category)
 * - Độ dài: 2 - 40 ký tự
 * - Cho phép: Backend, Cơ sở dữ liệu, DevOps & Cloud, Tối ưu & Tăng trưởng
 */
export function validateCategoryName(val) {
  const clean = sanitizeText(val);
  if (!clean) return 'Vui lòng chọn hoặc nhập danh mục.';
  if (clean.length < 2) return 'Tên danh mục tối thiểu 2 ký tự.';
  if (clean.length > 40) return 'Tên danh mục tối đa 40 ký tự.';
  if (!CATEGORY_NAME_REGEX.test(clean)) {
    return 'Tên danh mục chứa ký tự không được phép.';
  }
  return '';
}

// Ký tự được phép trong tên dự án / vai trò / công nghệ của dự án
const PROJECT_LABEL_REGEX = /^[\p{L}\p{N}\s.,+/&():_-]+$/u;

/**
 * Validate tên dự án (bắt buộc)
 * - Độ dài: 2 - 80 ký tự
 */
export function validateProjectName(val) {
  const clean = sanitizeText(val);
  if (!clean) return 'Vui lòng nhập tên dự án.';
  if (clean.length < 2) return 'Tên dự án tối thiểu 2 ký tự.';
  if (clean.length > 80) return 'Tên dự án tối đa 80 ký tự.';
  if (!PROJECT_LABEL_REGEX.test(clean)) {
    return 'Tên dự án chứa ký tự không được phép.';
  }
  return '';
}

/**
 * Validate vai trò trong dự án (không bắt buộc)
 * - Độ dài tối đa: 60 ký tự
 */
export function validateProjectRole(val) {
  const clean = sanitizeText(val);
  if (!clean) return '';
  if (clean.length > 60) return 'Vai trò tối đa 60 ký tự.';
  if (!PROJECT_LABEL_REGEX.test(clean)) {
    return 'Vai trò chứa ký tự không được phép.';
  }
  return '';
}

/**
 * Validate mô tả dự án (không bắt buộc)
 * - Độ dài tối đa: 300 ký tự
 * - Không chứa ký tự độc hại
 */
export function validateProjectDescription(val) {
  const clean = sanitizeText(val);
  if (!clean) return '';
  if (clean.length > 300) return 'Mô tả tối đa 300 ký tự.';
  if (containsDangerousChars(clean)) {
    return 'Mô tả chứa ký tự bất thường không được phép.';
  }
  return '';
}

/**
 * Validate liên kết dự án (không bắt buộc)
 * - Phải bắt đầu bằng http:// hoặc https://
 * - Độ dài tối đa: 200 ký tự
 */
export function validateProjectLink(val) {
  const clean = sanitizeText(val);
  if (!clean) return '';
  if (clean.length > 200) return 'Liên kết tối đa 200 ký tự.';
  if (!/^https?:\/\/\S+$/i.test(clean)) {
    return 'Liên kết phải bắt đầu bằng http:// hoặc https://';
  }
  return '';
}

/**
 * Validate tên công nghệ dùng trong dự án (bắt buộc khi thêm)
 * - Độ dài: 1 - 30 ký tự
 */
export function validateTechTag(val) {
  const clean = sanitizeText(val);
  if (!clean) return 'Vui lòng nhập tên công nghệ.';
  if (clean.length > 30) return 'Tên công nghệ tối đa 30 ký tự.';
  if (!SKILL_NAME_REGEX.test(clean)) {
    return 'Tên công nghệ chứa ký tự không được phép.';
  }
  return '';
}
