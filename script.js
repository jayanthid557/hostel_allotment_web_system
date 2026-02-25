// ==========================================
// DATA STRUCTURE - HOSTELS AND ROOMS
// ==========================================

const HOSTEL_DATABASE = {
    H1: {
        id: 'H1',
        name: 'Hostel 1 - North Wing',
        type: 'boys',
        icon: '🏢',
        rooms: [
            { id: 'H1R1', sharing: 15, total: 3, occupied: 0, price: 3000 },
            { id: 'H1R2', sharing: 12, total: 5, occupied: 1, price: 3500 },
            { id: 'H1R3', sharing: 8, total: 4, occupied: 0, price: 4000 },
            { id: 'H1R4', sharing: 4, total: 6, occupied: 2, price: 6000 },
            { id: 'H1R5', sharing: 2, total: 8, occupied: 3, price: 8000 }
        ]
    },
    H2: {
        id: 'H2',
        name: 'Hostel 2 - East Wing',
        type: 'boys',
        icon: '🏛️',
        rooms: [
            { id: 'H2R1', sharing: 15, total: 4, occupied: 1, price: 3000 },
            { id: 'H2R2', sharing: 12, total: 6, occupied: 0, price: 3500 },
            { id: 'H2R3', sharing: 8, total: 5, occupied: 2, price: 4000 },
            { id: 'H2R4', sharing: 5, total: 4, occupied: 1, price: 5000 },
            { id: 'H2R5', sharing: 4, total: 5, occupied: 0, price: 6000 },
            { id: 'H2R6', sharing: 2, total: 10, occupied: 4, price: 8000 }
        ]
    },
    H3: {
        id: 'H3',
        name: 'Hostel 3 - South Wing',
        type: 'girls',
        icon: '🏫',
        rooms: [
            { id: 'H3R1', sharing: 12, total: 4, occupied: 0, price: 3500 },
            { id: 'H3R2', sharing: 8, total: 6, occupied: 1, price: 4000 },
            { id: 'H3R3', sharing: 5, total: 5, occupied: 2, price: 5000 },
            { id: 'H3R4', sharing: 4, total: 8, occupied: 3, price: 6000 },
            { id: 'H3R5', sharing: 2, total: 12, occupied: 5, price: 8000 }
        ]
    },
    H4: {
        id: 'H4',
        name: 'Hostel 4 - West Wing',
        type: 'girls',
        icon: '🏘️',
        rooms: [
            { id: 'H4R1', sharing: 15, total: 2, occupied: 0, price: 3000 },
            { id: 'H4R2', sharing: 12, total: 3, occupied: 0, price: 3500 },
            { id: 'H4R3', sharing: 8, total: 7, occupied: 2, price: 4000 },
            { id: 'H4R4', sharing: 5, total: 6, occupied: 1, price: 5000 },
            { id: 'H4R5', sharing: 4, total: 10, occupied: 4, price: 6000 },
            { id: 'H4R6', sharing: 2, total: 15, occupied: 8, price: 8000 }
        ]
    }
};

// ==========================================
// GLOBAL STATE
// ==========================================

let currentUser = null;
let allBookings = [];
let selectedRoom = null;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    renderDashboard();
    renderHostels();
    renderAllRooms();
    
    console.log('%c🏠 University Hostel Portal Initialized', 'color: #1e40af; font-size: 16px; font-weight: bold;');
    console.log('%cDemo Credentials:', 'color: #059669; font-weight: bold;');
    console.log('Admin: admin / admin123');
    console.log('Student: student / student123');
});

// ==========================================
// LOCAL STORAGE
// ==========================================

function loadFromLocalStorage() {
    const savedHostels = localStorage.getItem('hostel_database');
    const savedBookings = localStorage.getItem('all_bookings');
    
    if (savedHostels) {
        Object.assign(HOSTEL_DATABASE, JSON.parse(savedHostels));
    }
    if (savedBookings) {
        allBookings = JSON.parse(savedBookings);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('hostel_database', JSON.stringify(HOSTEL_DATABASE));
    localStorage.setItem('all_bookings', JSON.stringify(allBookings));
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Auth buttons
    document.getElementById('btn-login').addEventListener('click', () => openModal('login-modal'));
    document.getElementById('btn-register').addEventListener('click', () => openModal('register-modal'));
    document.getElementById('btn-logout').addEventListener('click', handleLogout);

    // Forms
    document.getElementById('form-login').addEventListener('submit', handleLogin);
    document.getElementById('form-register').addEventListener('submit', handleRegister);

    // Close modals on outside click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// ==========================================
// TAB SWITCHING
// ==========================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Load tab-specific content
    if (tabName === 'dashboard') {
        renderDashboard();
    } else if (tabName === 'hostels') {
        renderHostels();
    } else if (tabName === 'rooms') {
        renderAllRooms();
    } else if (tabName === 'bookings') {
        renderMyBookings();
    } else if (tabName === 'management') {
        renderAdminPanel();
    }
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function switchModal(targetModalId) {
    closeModal('login-modal');
    closeModal('register-modal');
    openModal(targetModalId);
}

// ==========================================
// AUTHENTICATION
// ==========================================

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('input-login-user').value;
    const password = document.getElementById('input-login-pass').value;
    const role = document.getElementById('input-login-role').value;

    // Demo authentication
    if ((username === 'admin' && password === 'admin123' && role === 'admin') ||
        (username === 'student' && password === 'student123' && role === 'student')) {
        
        currentUser = {
            username: username,
            name: role === 'admin' ? 'Administrator' : 'John Doe',
            email: role === 'admin' ? 'admin@university.edu' : 'student@university.edu',
            role: role
        };

        updateUIAfterLogin();
        closeModal('login-modal');
        alert(`✅ Welcome ${currentUser.name}!`);

        if (role === 'admin') {
            switchTab('management');
        }
    } else {
        alert('❌ Invalid credentials!\n\nTry:\nAdmin: admin / admin123\nStudent: student / student123');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('input-reg-name').value;
    const email = document.getElementById('input-reg-email').value;
    const phone = document.getElementById('input-reg-phone').value;
    const username = document.getElementById('input-reg-username').value;
    const password = document.getElementById('input-reg-password').value;

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');

    if (users.find(u => u.username === username || u.email === email)) {
        alert('❌ Username or Email already exists!');
        return;
    }

    users.push({ name, email, phone, username, password, role: 'student' });
    localStorage.setItem('registered_users', JSON.stringify(users));

    alert('✅ Registration successful! Please login.');
    closeModal('register-modal');
    openModal('login-modal');
}

function handleLogout() {
    currentUser = null;
    updateUIAfterLogout();
    switchTab('dashboard');
    alert('👋 Logged out successfully!');
}

function updateUIAfterLogin() {
    document.getElementById('btn-login').classList.add('hidden');
    document.getElementById('btn-register').classList.add('hidden');
    document.getElementById('btn-logout').classList.remove('hidden');
    document.getElementById('user-welcome').classList.remove('hidden');
    document.getElementById('user-name-display').textContent = currentUser.name;

    if (currentUser.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    }

    renderDashboard();
}

function updateUIAfterLogout() {
    document.getElementById('btn-login').classList.remove('hidden');
    document.getElementById('btn-register').classList.remove('hidden');
    document.getElementById('btn-logout').classList.add('hidden');
    document.getElementById('user-welcome').classList.add('hidden');
    document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
}

// ==========================================
// DASHBOARD RENDERING
// ==========================================

function renderDashboard() {
    const stats = calculateStatistics();
    
    document.getElementById('total-hostels').textContent = Object.keys(HOSTEL_DATABASE).length;
    document.getElementById('available-rooms').textContent = stats.available;
    document.getElementById('my-bookings-count').textContent = currentUser ? 
        allBookings.filter(b => b.userEmail === currentUser.email).length : 0;
}

function calculateStatistics() {
    let total = 0;
    let occupied = 0;

    Object.values(HOSTEL_DATABASE).forEach(hostel => {
        hostel.rooms.forEach(room => {
            total += room.total;
            occupied += room.occupied;
        });
    });

    return {
        total: total,
        occupied: occupied,
        available: total - occupied,
        pending: allBookings.filter(b => b.status === 'pending').length
    };
}

// ==========================================
// HOSTELS RENDERING
// ==========================================

function renderHostels() {
    const container = document.getElementById('hostels-container');
    container.innerHTML = '';

    Object.values(HOSTEL_DATABASE).forEach(hostel => {
        let totalRooms = 0;
        let occupiedRooms = 0;

        hostel.rooms.forEach(room => {
            totalRooms += room.total;
            occupiedRooms += room.occupied;
        });

        const availableRooms = totalRooms - occupiedRooms;

        const card = `
            <div class="hostel-card">
                <div class="hostel-image">${hostel.icon}</div>
                <div class="hostel-content">
                    <h3>${hostel.name}</h3>
                    <span class="hostel-type-badge">${hostel.type.toUpperCase()}</span>
                    <div class="hostel-stats">
                        <div class="hostel-stat-item">
                            <span>Total Rooms</span>
                            <strong>${totalRooms}</strong>
                        </div>
                        <div class="hostel-stat-item">
                            <span>Occupied</span>
                            <strong>${occupiedRooms}</strong>
                        </div>
                        <div class="hostel-stat-item">
                            <span>Available</span>
                            <strong>${availableRooms}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// ==========================================
// ROOMS RENDERING
// ==========================================

function renderAllRooms(filters = {}) {
    const container = document.getElementById('rooms-container');
    container.innerHTML = '';

    let allRooms = [];

    Object.values(HOSTEL_DATABASE).forEach(hostel => {
        hostel.rooms.forEach(room => {
            allRooms.push({
                ...room,
                hostelId: hostel.id,
                hostelName: hostel.name,
                hostelType: hostel.type
            });
        });
    });

    // Apply filters
    if (filters.hostel && filters.hostel !== 'all') {
        allRooms = allRooms.filter(r => r.hostelId === filters.hostel);
    }
    if (filters.type && filters.type !== 'all') {
        allRooms = allRooms.filter(r => r.hostelType === filters.type);
    }
    if (filters.sharing && filters.sharing !== 'all') {
        allRooms = allRooms.filter(r => r.sharing === parseInt(filters.sharing));
    }

    if (allRooms.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No rooms found matching your filters</h3></div>';
        return;
    }

    allRooms.forEach(room => {
        const available = room.total - room.occupied;
        let availStatus = 'available';
        let availText = `${available} Rooms Available`;

        if (available === 0) {
            availStatus = 'full';
            availText = 'Fully Occupied';
        } else if (available <= 2) {
            availStatus = 'limited';
            availText = `Only ${available} Left!`;
        }

        const card = `
            <div class="room-card">
                <div class="room-card-header">
                    <h4>${room.sharing} Sharing Room</h4>
                    <p class="room-hostel-name">${room.hostelName}</p>
                </div>
                <div class="room-card-body">
                    <div class="room-info-grid">
                        <div class="room-info-item">
                            <span class="room-info-label">Capacity</span>
                            <span class="room-info-value">${room.sharing}</span>
                        </div>
                        <div class="room-info-item">
                            <span class="room-info-label">Total Rooms</span>
                            <span class="room-info-value">${room.total}</span>
                        </div>
                        <div class="room-info-item">
                            <span class="room-info-label">Occupied</span>
                            <span class="room-info-value">${room.occupied}</span>
                        </div>
                        <div class="room-info-item">
                            <span class="room-info-label">Available</span>
                            <span class="room-info-value">${available}</span>
                        </div>
                    </div>
                    <div class="room-price">₹${room.price}/month</div>
                    <div class="room-availability ${availStatus}">${availText}</div>
                    <button class="room-book-btn" onclick="initiateBooking('${room.id}')" 
                        ${available === 0 || !currentUser ? 'disabled' : ''}>
                        ${!currentUser ? '🔒 Login to Book' : available === 0 ? '❌ Not Available' : '✅ Book Now'}
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function filterRooms() {
    const filters = {
        hostel: document.getElementById('filter-hostel').value,
        type: document.getElementById('filter-type').value,
        sharing: document.getElementById('filter-sharing').value
    };
    renderAllRooms(filters);
}

function resetFilters() {
    document.getElementById('filter-hostel').value = 'all';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-sharing').value = 'all';
    renderAllRooms();
}

// ==========================================
// BOOKING FUNCTIONS
// ==========================================

function initiateBooking(roomId) {
    if (!currentUser) {
        alert('⚠️ Please login first!');
        openModal('login-modal');
        return;
    }

    // Check existing bookings
    const existing = allBookings.find(b => b.userEmail === currentUser.email && 
        (b.status === 'pending' || b.status === 'approved'));
    
    if (existing) {
        alert('⚠️ You already have an active booking!');
        return;
    }

    selectedRoom = findRoomById(roomId);
    if (!selectedRoom) return;

    const summary = `
        <div style="padding: 1rem 0;">
            <div style="display: grid; gap: 1rem;">
                <div>
                    <strong>Hostel:</strong> ${selectedRoom.hostelName}
                </div>
                <div>
                    <strong>Room Type:</strong> ${selectedRoom.sharing} Sharing
                </div>
                <div>
                    <strong>Price per Month:</strong> ₹${selectedRoom.price}
                </div>
                <div>
                    <strong>Student:</strong> ${currentUser.name}
                </div>
            </div>
        </div>
    `;

    document.getElementById('booking-details-summary').innerHTML = summary;
    openModal('confirm-modal');
}

function submitBooking() {
    if (!selectedRoom || !currentUser) return;

    const booking = {
        id: 'BK' + Date.now(),
        roomId: selectedRoom.id,
        hostelId: selectedRoom.hostelId,
        hostelName: selectedRoom.hostelName,
        roomSharing: selectedRoom.sharing,
        price: selectedRoom.price,
        userName: currentUser.name,
        userEmail: currentUser.email,
        status: 'pending',
        date: new Date().toLocaleDateString()
    };

    allBookings.push(booking);
    saveToLocalStorage();
    closeModal('confirm-modal');
    
    alert('✅ Booking request submitted successfully!\nWaiting for admin approval.');
    switchTab('bookings');
}

function findRoomById(roomId) {
    for (let hostel of Object.values(HOSTEL_DATABASE)) {
        const room = hostel.rooms.find(r => r.id === roomId);
        if (room) {
            return {
                ...room,
                hostelId: hostel.id,
                hostelName: hostel.name
            };
        }
    }
    return null;
}

// ==========================================
// MY BOOKINGS
// ==========================================

function renderMyBookings() {
    const container = document.getElementById('my-bookings-container');

    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔒</div>
                <h3>Please Login</h3>
                <p>Login to view your bookings</p>
            </div>
        `;
        return;
    }

    const myBookings = allBookings.filter(b => b.userEmail === currentUser.email);

    if (myBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>No Bookings Yet</h3>
                <p>You haven't made any booking requests. Browse available rooms to get started.</p>
                <button class="cta-button" onclick="switchTab('rooms')">Browse Rooms</button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    myBookings.forEach(booking => {
        const card = `
            <div class="booking-card">
                <div class="booking-header">
                    <span class="booking-id">Booking ID: ${booking.id}</span>
                    <span class="booking-status ${booking.status}">${booking.status.toUpperCase()}</span>
                </div>
                <div class="booking-details-grid">
                    <div class="booking-detail-item">
                        <h4>Hostel</h4>
                        <p>${booking.hostelName}</p>
                    </div>
                    <div class="booking-detail-item">
                        <h4>Room Type</h4>
                        <p>${booking.roomSharing} Sharing</p>
                    </div>
                    <div class="booking-detail-item">
                        <h4>Price/Month</h4>
                        <p>₹${booking.price}</p>
                    </div>
                    <div class="booking-detail-item">
                        <h4>Request Date</h4>
                        <p>${booking.date}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// ==========================================
// ADMIN PANEL
// ==========================================

function renderAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('⚠️ Admin access only!');
        switchTab('dashboard');
        return;
    }

    const stats = calculateStatistics();
    
    document.getElementById('admin-total').textContent = stats.total;
    document.getElementById('admin-occupied').textContent = stats.occupied;
    document.getElementById('admin-available').textContent = stats.available;
    document.getElementById('admin-pending').textContent = stats.pending;

    renderPendingRequests();
    renderOccupancyChart();
}

function renderPendingRequests() {
    const tbody = document.getElementById('requests-table-body');
    const pending = allBookings.filter(b => b.status === 'pending');

    if (pending.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:#999;">No pending requests</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    pending.forEach(booking => {
        const row = `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.userName}</td>
                <td>${booking.userEmail}</td>
                <td>${booking.hostelName}</td>
                <td>${booking.roomSharing} Sharing</td>
                <td>${booking.date}</td>
                <td><span class="booking-status pending">PENDING</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="approve-btn" onclick="approveBooking('${booking.id}')">✅ Approve</button>
                        <button class="reject-btn" onclick="rejectBooking('${booking.id}')">❌ Reject</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function approveBooking(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.status = 'approved';

    // Update room occupancy
    const hostel = HOSTEL_DATABASE[booking.hostelId];
    const room = hostel.rooms.find(r => r.id === booking.roomId);
    if (room) {
        room.occupied++;
    }

    saveToLocalStorage();
    renderAdminPanel();
    alert(`✅ Booking ${bookingId} approved!`);
}

function rejectBooking(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'rejected';
        saveToLocalStorage();
        renderAdminPanel();
        alert(`❌ Booking ${bookingId} rejected!`);
    }
}

function renderOccupancyChart() {
    const container = document.getElementById('hostel-occupancy-chart');
    container.innerHTML = '';

    Object.values(HOSTEL_DATABASE).forEach(hostel => {
        let total = 0;
        let occupied = 0;

        hostel.rooms.forEach(room => {
            total += room.total;
            occupied += room.occupied;
        });

        const percent = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;

        const item = `
            <div class="occupancy-item">
                <h4>${hostel.name}</h4>
                <div class="occupancy-bar-container">
                    <div class="occupancy-bar-fill" style="width: ${percent}%">${percent}%</div>
                </div>
                <div class="occupancy-text">
                    <span>Occupied: ${occupied} / ${total}</span>
                    <span>${total - occupied} Available</span>
                </div>
            </div>
        `;
        container.innerHTML += item;
    });
}
