// --- MOCK DATABASE ---
const mockDatabase = {
    '0981112222': { name: 'เนย', queue: '#1001', date: '25/02/2569', table: '5', time: '20:00 น.', completed: false },
    '0983334444': { name: 'ทิม', queue: '#1002', date: '25/02/2569', table: '6', time: '20:00 น.', completed: false },
    '0985556666': { name: 'โซเฟีย', queue: '#1003', date: '25/02/2569', table: '3', time: '17:00 น.', completed: false },
    '0987778888': { name: 'บลู', queue: '#1004', date: '25/02/2569', table: '4', time: '15:00 น.', completed: false },
    '0989998888': { name: 'โนอี้', queue: '#12345', date: '25/01/2569', table: '7', time: '14:00 น.', completed: false },

    '0991111111': { name: 'เสือ', queue: '#0001', date: '25/02/2569', table: '2', time: '13:00 น.', completed: true },
    '0992222222': { name: 'มาตา', queue: '#0002', date: '25/02/2569', table: '1', time: '13:00 น.', completed: true },
    '0993333333': { name: 'จินนี่', queue: '#0003', date: '25/02/2569', table: '2', time: '13:00 น.', completed: true },
    '0994444444': { name: 'เอวา', queue: '#0004', date: '25/02/2569', table: '1', time: '12:00 น.', completed: true },
};

// LOGIN
function handleLogin() {
    document.getElementById('login-view').classList.add('hidden');
    const dashboard = document.getElementById('dashboard-view');
    dashboard.classList.remove('hidden');
    dashboard.classList.add('flex');
}

function handleLogout() {
    const dashboard = document.getElementById('dashboard-view');
    dashboard.classList.add('hidden');
    dashboard.classList.remove('flex');
    document.getElementById('login-view').classList.remove('hidden');
}

// เปลี่ยนสถานะ
function changeStatus(element) {
    if (element.getAttribute('data-status') === 'processing') {

        element.innerText = "เสร็จสิ้น";
        element.classList.remove('bg-gray-100', 'text-gray-800', 'hover:opacity-80', 'cursor-pointer');
        element.classList.add('bg-coco-blue', 'text-white');
        element.setAttribute('data-status', 'completed');

        var row = element.closest('tr');
        var skipBtn = row.querySelector('.skip-btn');
        if (skipBtn) {
            skipBtn.classList.add('hidden');
        }

        const phoneNumber = element.getAttribute('data-phone');
        if (phoneNumber && mockDatabase[phoneNumber]) {
            mockDatabase[phoneNumber].completed = true;
        }
    }
}

// ลบแถว
function deleteRow(btnElement) {
    if (confirm("ต้องการข้ามคิวนี้ ใช่หรือไม่?")) {
        var row = btnElement.closest('tr');
        if (row) {
            row.remove();
        }
    }
}