// ============================================================
// admin-data.js — จัดการข้อมูล Admin ผ่าน localStorage
// แทนที่ Prisma + TypeScript เดิม
// ============================================================

// key ที่ใช้เก็บข้อมูล Admin ใน localStorage
const ADMIN_STORAGE_KEY = 'coco_admin';

// ── ข้อมูลตั้งต้น (ใช้ครั้งแรกที่ยังไม่มีข้อมูลใน localStorage) ──
// ข้อมูล Admin ตั้งต้น — ใช้ครั้งแรกที่ยังไม่เคย login หรือตั้งค่าไว้
// เปลี่ยนรหัสผ่านได้ผ่านหน้า forgot_Admin.html
const DEFAULT_ADMIN = {
    username: 'Admin',
    phone: '0999999999',
    password: 'Admin1234'
};

// ดึงข้อมูล Admin จาก localStorage (ถ้าไม่มีใช้ค่า default)
// ดึงข้อมูล Admin จาก localStorage
// ถ้าไม่มี (เปิดครั้งแรก) ให้ใช้ DEFAULT_ADMIN แทน
function getAdmin() {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
}

// บันทึกข้อมูล Admin ลง localStorage
// บันทึกข้อมูล Admin กลับลง localStorage
function saveAdmin(adminData) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
}

// Login Admin — คืนค่า { success, message }
// ตรวจสอบ Login Admin
// เปรียบเทียบ username + phone + password กับที่เก็บไว้
// ถ้าถูกต้อง → บันทึก isAdminLoggedIn='true' และคืน { success: true }
function loginAdmin(username, phone, password) {
    const admin = getAdmin();
    if (admin.username === username && admin.phone === phone && admin.password === password) {
        localStorage.setItem('isAdminLoggedIn', 'true'); // flag ว่า login แล้ว
        return { success: true };
    }
    return { success: false, message: 'ข้อมูลไม่ถูกต้อง' };
}

// ยืนยันตัวตน (สำหรับลืมรหัสผ่าน) — คืนค่า true/false
// ยืนยันตัวตน Admin สำหรับกรณีลืมรหัสผ่าน
// ตรวจแค่ชื่อ + เบอร์ (ไม่ต้องใส่รหัสผ่าน) คืนค่า true/false
function verifyAdmin(username, phone) {
    const admin = getAdmin();
    return admin.username === username && admin.phone === phone;
}

// เปลี่ยนรหัสผ่าน — คืนค่า { success, message }
// เปลี่ยนรหัสผ่าน Admin
// เงื่อนไข: รหัสสองช่องต้องตรงกัน และยาวอย่างน้อย 8 ตัว
function changePassword(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        return { success: false, message: 'รหัสผ่านไม่ตรงกัน' };
    }
    if (newPassword.length < 8) {
        return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว' };
    }
    const admin = getAdmin();   // ดึงข้อมูลเดิม
    admin.password = newPassword; // อัปเดตเฉพาะ password
    saveAdmin(admin);             // บันทึกกลับ
    return { success: true };
}

// Logout Admin
// Logout Admin — ลบ flag isAdminLoggedIn ออกจาก localStorage
function logoutAdmin() {
    localStorage.removeItem('isAdminLoggedIn');
}

// ตรวจว่า Admin login อยู่ไหม
// ตรวจว่า Admin login อยู่ไหม
// ใช้ใน Dashboard.html เพื่อ guard หน้าที่ต้องการ auth
function isAdminLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
}