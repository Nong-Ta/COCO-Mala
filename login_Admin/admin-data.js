// ============================================================
// admin-data.js — จัดการข้อมูล Admin ผ่าน localStorage
// แทนที่ Prisma + TypeScript เดิม
// ============================================================

const ADMIN_STORAGE_KEY = 'coco_admin';

// ── ข้อมูลตั้งต้น (ใช้ครั้งแรกที่ยังไม่มีข้อมูลใน localStorage) ──
const DEFAULT_ADMIN = {
    username: 'Admin',
    phone: '0999999999',
    password: 'Admin1234'
};

// ดึงข้อมูล Admin จาก localStorage (ถ้าไม่มีใช้ค่า default)
function getAdmin() {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
}

// บันทึกข้อมูล Admin ลง localStorage
function saveAdmin(adminData) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
}

// Login Admin — คืนค่า { success, message }
function loginAdmin(username, phone, password) {
    const admin = getAdmin();
    if (admin.username === username && admin.phone === phone && admin.password === password) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        return { success: true };
    }
    return { success: false, message: 'ข้อมูลไม่ถูกต้อง' };
}

// ยืนยันตัวตน (สำหรับลืมรหัสผ่าน) — คืนค่า true/false
function verifyAdmin(username, phone) {
    const admin = getAdmin();
    return admin.username === username && admin.phone === phone;
}

// เปลี่ยนรหัสผ่าน — คืนค่า { success, message }
function changePassword(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        return { success: false, message: 'รหัสผ่านไม่ตรงกัน' };
    }
    if (newPassword.length < 8) {
        return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว' };
    }
    const admin = getAdmin();
    admin.password = newPassword;
    saveAdmin(admin);
    return { success: true };
}

// Logout Admin
function logoutAdmin() {
    localStorage.removeItem('isAdminLoggedIn');
}

// ตรวจว่า Admin login อยู่ไหม
function isAdminLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
}