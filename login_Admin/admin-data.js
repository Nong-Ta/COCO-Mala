// ============================================================
// admin-data.js — จัดการข้อมูล Admin ผ่าน localStorage
// ============================================================

const ADMIN_STORAGE_KEY = 'coco_admin';

// ข้อมูล Admin ตั้งต้น — เปลี่ยนได้ผ่านหน้า forgot_Admin.html
const DEFAULT_ADMIN = {
    email: 'admin@cocomala.com',
    password: 'Admin1234'
};

// ดึงข้อมูล Admin จาก localStorage
// ถ้าไม่มี (เปิดครั้งแรก) ให้ใช้ DEFAULT_ADMIN แทน
function getAdmin() {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
}

// บันทึกข้อมูล Admin กลับลง localStorage
function saveAdmin(adminData) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
}

// ตรวจสอบ Login Admin ด้วย email + password
// ถ้าถูกต้อง → บันทึก isAdminLoggedIn='true' และคืน { success: true }
function loginAdmin(email, password) {
    const admin = getAdmin();
    if (admin.email === email && admin.password === password) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        return { success: true };
    }
    return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
}

// ตรวจว่า email นี้มีในระบบไหม (สำหรับขอ OTP)
function verifyAdminEmail(email) {
    const admin = getAdmin();
    return admin.email === email;
}

// สร้าง OTP 6 หลัก เก็บใน localStorage พร้อม timestamp หมดอายุ 5 นาที
function generateOTP(email) {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = Date.now() + 5 * 60 * 1000;
    localStorage.setItem('admin_otp', JSON.stringify({ otp, email, expiry }));
    return otp; // ในระบบจริงส่งผ่าน email API แทน
}

// ตรวจ OTP ที่ผู้ใช้กรอก
// คืนค่า { success, message }
function verifyOTP(email, inputOTP) {
    const stored = localStorage.getItem('admin_otp');
    if (!stored) return { success: false, message: 'ไม่พบรหัส OTP กรุณาขอใหม่' };
    const { otp, email: storedEmail, expiry } = JSON.parse(stored);
    if (Date.now() > expiry) {
        localStorage.removeItem('admin_otp');
        return { success: false, message: 'รหัส OTP หมดอายุแล้ว กรุณาขอใหม่' };
    }
    if (storedEmail !== email || otp !== inputOTP) {
        return { success: false, message: 'รหัส OTP ไม่ถูกต้อง' };
    }
    localStorage.setItem('adminVerified', 'true');
    localStorage.removeItem('admin_otp');
    return { success: true };
}

// เปลี่ยนรหัสผ่าน Admin
// เงื่อนไข: รหัสสองช่องต้องตรงกัน และยาวอย่างน้อย 8 ตัว
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

// Logout Admin — ลบ flag isAdminLoggedIn ออกจาก localStorage
function logoutAdmin() {
    localStorage.removeItem('isAdminLoggedIn');
}

// ตรวจว่า Admin login อยู่ไหม
// ใช้ใน Dashboard.html เพื่อ guard หน้าที่ต้องการ auth
function isAdminLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
}