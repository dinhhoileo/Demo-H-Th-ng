// Helper: load HTML file vào #main với hiệu ứng fade
async function loadPage(path, pushState = true) {
  const main = document.getElementById('main');
  main.style.opacity = 0;
  main.style.transform = 'translateY(10px)'; // Thêm hiệu ứng dịch chuyển nhẹ
  main.style.transition = 'opacity 0.3s, transform 0.3s';
  
  const res = await fetch(path);
  const html = await res.text();
  
  setTimeout(() => {
    main.innerHTML = html;
    setTimeout(() => {
      main.style.opacity = 1;
      main.style.transform = 'translateY(0)';
      
      if (pushState) {
        history.pushState({page: path}, '', '#' + path.replace(/^layout\//, '').replace('.html', ''));
      }
      
      afterPageLoad(path);
    }, 50);
  }, 200);
}

function showModal(msg, cb, withInput = false) {
  let modalBg = document.createElement('div');
  modalBg.className = 'modal-bg';
  let modal = document.createElement('div');
  modal.className = 'modal';
  if (withInput) {
    modal.innerHTML = `<div>${msg}</div><input type="text" id="modalInput"><br><button id="modalOk">OK</button>`;
  } else {
    modal.innerHTML = `<div>${msg}</div><button id="modalOk">OK</button>`;
  }
  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);
  setTimeout(() => modalBg.style.opacity = 1, 10);
  document.getElementById('modalOk').onclick = () => {
    let val = withInput ? document.getElementById('modalInput').value : null;
    document.body.removeChild(modalBg);
    if (cb) cb(val);
  };
}

// Điều hướng chính
let currentRole = null;
let lastPage = null;

function goto(page, ...args) {
  lastPage = page;
  let path = '';
  switch(page) {
    case 'dieuhuong': path = 'layout/DieuHuongDangNhap.html'; break;
    case 'dnsv': path = 'layout/DangNhapSinhVien.html'; break;
    case 'sv_dashboard': path = 'layout/BangDIeuKhienSinhVien.html'; break;
    case 'phieudrl_sv': path = 'layout/PhieuDRLSinhVien.html'; break;
    case 'laylaimk': path = 'layout/LayLaiMatKhau.html'; break;
    case 'dnbcs': path = 'layout/DangNhapBanCanSu.html'; break;
    case 'bcs_dashboard': path = 'layout/BangDieuKhienBCS.html'; break;
    case 'phieudrl_bcs': path = 'layout/PhieuDiemRenLuyenBCS.html'; break;
    case 'dncvht': path = 'layout/DangNhapCoVanHocTap.html'; break;
    case 'cvht_dashboard': path = 'layout/BangDieuKhienCVHT.html'; break;
    case 'danhsachlop': path = 'layout/DanhSachLop.html'; break;
    case 'phieudrl_cvht': path = 'layout/PhieuDiemRenLuyenCVHT.html'; break;
    case 'dnctsv': path = 'layout/DangNhapCongTacSinhVien.html'; break;
    case 'ctsv_dashboard': path = 'layout/BangDieuKhienCTSV.html'; break;
    default: path = 'layout/DieuHuongDangNhap.html';
  }
  loadPage(path, true);
}

// Hàm chèn header chung (có thể đặt ở cuối file hoặc gần các helper khác)
function insertAppHeader(roleName, homeRouteKey) {
    const headerPlaceholder = document.getElementById('app-header-placeholder');
    // Kiểm tra xem placeholder có tồn tại trên trang hiện tại không
    if (headerPlaceholder) {
        // Xác định đường dẫn trang chủ dựa vào route key
        let homeLink = '#dieuhuong'; // Mặc định
        switch(homeRouteKey) {
            case 'sv_dashboard': homeLink = '#BangDIeuKhienSinhVien'; break;
            case 'bcs_dashboard': homeLink = '#BangDieuKhienBCS'; break;
            case 'cvht_dashboard': homeLink = '#BangDieuKhienCVHT'; break;
            case 'ctsv_dashboard': homeLink = '#BangDieuKhienCTSV'; break;
        }

        const headerHTML = `
            <div class="page-header">
                <span class="role-info">Vai trò: ${roleName}</span>
                <div class="nav-links">
                    <a href="${homeLink}" onclick="goto('${homeRouteKey}'); return false;">Bảng điều khiển</a>
                    <a onclick="logout()">Đăng xuất</a>
                </div>
            </div>
        `;
        headerPlaceholder.innerHTML = headerHTML;
    }
}

// Xử lý sau khi load từng trang
function afterPageLoad(path) {
  // Fade-in hiệu ứng
  const main = document.getElementById('main');
  main.style.transition = 'opacity 0.3s, transform 0.3s';

  // Chèn header dựa trên trang được tải
  if (path.includes('BangDIeuKhienSinhVien')) {
    insertAppHeader('Sinh Viên', 'sv_dashboard');
    document.querySelector('.quick-btn.btn-green').onclick = () => goto('phieudrl_sv');
    document.querySelector('.quick-btn.btn-red').onclick = () => showModal('Chức năng gửi đơn phúc khảo đang phát triển!');
    document.querySelector('.quick-btn.btn-orange').onclick = () => showModal('Chức năng xem lịch học đang phát triển!');
    document.querySelector('.quick-btn.btn-purple').onclick = () => showModal('Chức năng xem điểm đang phát triển!');
  } else if (path.includes('BangDieuKhienBCS')) {
    insertAppHeader('Ban Cán Sự Lớp', 'bcs_dashboard');
    document.querySelector('.btn-blue').onclick = () => showModal('Đã thêm dữ liệu thành công!');
    document.querySelector('.btn-evaluate').onclick = () => goto('phieudrl_bcs');
    document.querySelector('.btn-red').onclick = () => showModal('Đã gửi đến cố vấn!');
    
    // Thêm sự kiện cho nút phản hồi mới
    const btnPhanHoi = document.querySelector('#btnPhanHoi');
    if (btnPhanHoi) {
        btnPhanHoi.onclick = () => showModal('Vui lòng nhập phản hồi của bạn:', null, true);
    }
  } else if (path.includes('BangDieuKhienCVHT')) {
    insertAppHeader('Cố Vấn Học Tập', 'cvht_dashboard');
    document.querySelector('.btn-blue').onclick = () => showModal('Tải danh sách thành công!');
    document.querySelector('.btn-orange').onclick = () => goto('danhsachlop');
    document.querySelector('.btn-green').onclick = () => showModal('Duyệt kết quả thành công!');
    document.querySelector('.btn-purple').onclick = () => showModal('Gửi kết quả cho CTSV thành công!');
  } else if (path.includes('BangDieuKhienCTSV')) {
    insertAppHeader('Phòng Công Tác Sinh Viên', 'ctsv_dashboard');
    document.querySelector('.btn-blue').onclick = () => showModal('Đã thông báo cho ban cán sự!');
    document.querySelector('.btn-list').onclick = () => goto('danhsachlop');
    document.querySelector('.btn-green').onclick = () => showModal('Lưu thành công!');
    document.querySelector('.update-btn').onclick = () => showModal('Đã lưu vào cơ sở dữ liệu!');
  }

  // Điều hướng và gắn sự kiện như cũ
  if (path.includes('DieuHuongDangNhap')) {
    const select = document.querySelector('select[name="role"], select.select-box');
    const btn = document.querySelector('button[type="submit"], .btn');
    if (select && btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        currentRole = select.value || select.options[select.selectedIndex].text;
        switch (currentRole.trim()) {
          case 'Sinh Viên':
            goto('dnsv');
            break;
          case 'Ban Cán Sự Lớp':
            goto('dnbcs');
            break;
          case 'Cố Vấn Học Tập':
            goto('dncvht');
            break;
          case 'Phòng Công Tác Sinh Viên':
            goto('dnctsv');
            break;
          default:
            goto('dieuhuong');
        }
      };
    }
  }
  if (path.includes('DangNhapSinhVien')) {
    document.querySelector('.login-btn').onclick = (e) => { e.preventDefault(); goto('sv_dashboard'); };
    document.querySelector('.forgot-link').onclick = () => goto('laylaimk');
  }
  if (path.includes('PhieuDRLSinhVien')) {
    // Cho phép nhập điểm
    document.querySelectorAll('td:nth-child(4)').forEach(td => {
      if (!td.querySelector('input')) {
        td.innerHTML = `<input type="number" style="width:60px; font-size:15px;" min="0" max="100" value="${td.textContent.trim()}">`;
      }
    });
    document.querySelector('.btn-blue').onclick = () => showModal('Lưu thành công!');
    document.querySelector('.btn-green').onclick = () => showModal('Nộp thành công!');
  }
  if (path.includes('LayLaiMatKhau')) {
    document.querySelector('.confirm-btn').onclick = (e) => { e.preventDefault(); showModal('Đã gửi yêu cầu lấy lại mật khẩu!'); };
  }
  if (path.includes('DangNhapBanCanSu')) {
    document.querySelector('.login-btn').onclick = (e) => { e.preventDefault(); goto('bcs_dashboard'); };
    document.querySelector('.forgot-link').onclick = () => goto('laylaimk');
  }
  if (path.includes('PhieuDiemRenLuyenBCS')) {
    const backButton = document.querySelector('.btn-gray'); // Giả sử bạn đã thêm nút này với class btn-gray
    if (backButton) {
        backButton.onclick = () => goto('bcs_dashboard');
    }
    document.querySelectorAll('td:nth-child(4), td:nth-child(5)').forEach(td => {
      if (!td.querySelector('input')) {
        td.innerHTML = `<input type="number" style="width:60px; font-size:15px;" min="0" max="100" value="${td.textContent.trim()}">`;
      }
    });
    document.querySelector('.btn-blue').onclick = () => showModal('Lưu thành công!');
    document.querySelector('.btn-green').onclick = () => showModal('Nộp thành công!');
    document.querySelector('#btn-feedback').onclick = () => {
        const feedbackPopup = document.getElementById('feedback-popup');
        feedbackPopup.style.display = 'flex';
        
        // Thêm sự kiện cho nút OK trong popup
        document.getElementById('feedback-ok').onclick = () => {
            feedbackPopup.style.display = 'none';
        };
    };
  }
  if (path.includes('DangNhapCoVanHocTap')) {
    document.querySelector('.login-btn').onclick = (e) => { e.preventDefault(); goto('cvht_dashboard'); };
    document.querySelector('.forgot-link').onclick = () => goto('laylaimk');
  }
  if (path.includes('DanhSachLop')) {
    document.querySelectorAll('tbody tr').forEach(tr => {
      tr.onclick = () => goto('phieudrl_cvht');
      tr.style.cursor = 'pointer'; // Thêm con trỏ để biểu thị phần tử có thể click
      
      // Thêm hiệu ứng hover
      tr.addEventListener('mouseenter', () => {
        tr.style.backgroundColor = '#e3f2fd';
        tr.style.transition = 'background-color 0.3s';
      });
      
      tr.addEventListener('mouseleave', () => {
        if (tr.rowIndex % 2 === 0) {
          tr.style.backgroundColor = '#f5f5f5';
        } else {
          tr.style.backgroundColor = '';
        }
      });
    });
  }
  if (path.includes('PhieuDiemRenLuyenCVHT')) {
    document.querySelectorAll('td:nth-child(4), td:nth-child(5)').forEach(td => {
      if (!td.querySelector('input')) {
        td.innerHTML = `<input type="number" style="width:60px; font-size:15px;" min="0" max="100" value="${td.textContent.trim()}">`;
      }
    });
    document.querySelector('.btn-blue').onclick = () => showModal('Phản hồi thành công!', null, true);
    document.querySelector('.btn-green').onclick = () => showModal('Xác nhận thành công!');
  }
  if (path.includes('DangNhapCongTacSinhVien')) {
    document.querySelector('.login-btn').onclick = (e) => { e.preventDefault(); goto('ctsv_dashboard'); };
    document.querySelector('.forgot-link').onclick = () => goto('laylaimk');
  }

  attachStudentListEvents();

  // Thêm hiệu ứng cho các nút sau khi trang đã tải xong
  setTimeout(addButtonEffects, 300);
}

// Hỗ trợ nút quay lại trình duyệt
window.onpopstate = function(event) {
  let hash = location.hash.replace('#', '');
  let page = 'dieuhuong';
  if (hash.includes('DangNhapSinhVien')) page = 'dnsv';
  else if (hash.includes('BangDIeuKhienSinhVien')) page = 'sv_dashboard';
  else if (hash.includes('PhieuDRLSinhVien')) page = 'phieudrl_sv';
  else if (hash.includes('LayLaiMatKhau')) page = 'laylaimk';
  else if (hash.includes('DangNhapBanCanSu')) page = 'dnbcs';
  else if (hash.includes('BangDieuKhienBCS')) page = 'bcs_dashboard';
  else if (hash.includes('PhieuDiemRenLuyenBCS')) page = 'phieudrl_bcs';
  else if (hash.includes('DangNhapCoVanHocTap')) page = 'dncvht';
  else if (hash.includes('BangDieuKhienCVHT')) page = 'cvht_dashboard';
  else if (hash.includes('DanhSachLop')) page = 'danhsachlop';
  else if (hash.includes('PhieuDiemRenLuyenCVHT')) page = 'phieudrl_cvht';
  else if (hash.includes('DangNhapCongTacSinhVien')) page = 'dnctsv';
  else if (hash.includes('BangDieuKhienCTSV')) page = 'ctsv_dashboard';
  goto(page);
};

// Khởi động
window.onload = () => {
  document.getElementById('main').style.opacity = 1;
  goto('dieuhuong');
};

function attachStudentListEvents() {
    const studentStatusData = {
        "22522100": "Chưa Đánh Giá",
        "22522201": "Đã Đánh Giá",
        "22522202": "Chưa Đánh Giá",
        "22522203": "Đã Đánh Giá",
        // ... thêm các MSSV khác nếu muốn ...
    };

    document.querySelectorAll('#studentList div').forEach(function(item) {
        item.addEventListener('click', function() {
            const text = this.textContent;
            const parts = text.split(' - ');
            const mssv = parts[0];
            const name = parts[1];

            document.getElementById('studentName').textContent = 'Họ và tên: ' + name;
            document.getElementById('studentId').textContent = 'MSSV: ' + mssv;

            const status = studentStatusData[mssv] || "Chưa Đánh Giá";
            const statusColor = status === "Đã Đánh Giá" ? "#27ae60" : "#e67e22";
            document.getElementById('studentStatus').innerHTML = 'Trạng thái: <span style="color:' + statusColor + ';">' + status + '</span>';
        });
    });
}

attachStudentListEvents(); 

// Hàm đăng xuất
function logout() {
  localStorage.removeItem('currentUser');
  loadPage('DieuHuongDangNhap.html');
}

// Thêm hiệu ứng ripple cho các nút khi click
function addButtonEffects() {
  const buttons = document.querySelectorAll('.action-btn, .back-btn, button');
  
  buttons.forEach(button => {
    if (!button.classList.contains('has-effect')) {
      button.classList.add('has-effect');
      
      button.addEventListener('click', function(e) {
        if (!this.classList.contains('no-ripple')) {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const ripple = document.createElement('span');
          ripple.style.position = 'absolute';
          ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          ripple.style.borderRadius = '50%';
          ripple.style.width = '0';
          ripple.style.height = '0';
          ripple.style.transform = 'translate(-50%, -50%)';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          ripple.style.pointerEvents = 'none';
          
          button.style.position = 'relative';
          button.style.overflow = 'hidden';
          button.appendChild(ripple);
          
          const animation = ripple.animate(
            [
              { width: '0', height: '0', opacity: 1 },
              { width: '400px', height: '400px', opacity: 0 }
            ],
            {
              duration: 600,
              easing: 'ease-out'
            }
          );
          
          animation.onfinish = () => {
            if (ripple.parentNode === button) {
              button.removeChild(ripple);
            }
          };
        }
      });
    }
  });
}

// Thêm một hàm mới để xử lý các sự kiện tr trong bảng
function enhanceTableInteractions() {
  const tableRows = document.querySelectorAll('table tbody tr');
  tableRows.forEach(tr => {
    if (!tr.classList.contains('group-row') && !tr.classList.contains('no-click')) {
      tr.style.cursor = 'pointer';
      
      tr.addEventListener('mouseenter', () => {
        tr.style.backgroundColor = '#e3f2fd';
        tr.style.transition = 'background-color 0.3s';
      });
      
      tr.addEventListener('mouseleave', () => {
        if (tr.rowIndex % 2 === 0) {
          tr.style.backgroundColor = '#f5f5f5';
        } else {
          tr.style.backgroundColor = '';
        }
      });
    }
  });
}

// Hàm để lưu điểm đánh giá của sinh viên
function saveStudentEvaluation(studentId, evaluationData) {
    // Lấy tất cả dữ liệu đánh giá hiện tại
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || {};
    
    // Thêm/cập nhật đánh giá của sinh viên
    if (!evaluations[studentId]) {
        evaluations[studentId] = {};
    }
    
    // Lưu dữ liệu sinh viên đánh giá
    evaluations[studentId].studentEval = evaluationData;
    evaluations[studentId].status = 'pendingBCS'; // Chờ BCS đánh giá
    
    // Lưu trở lại localStorage
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
    
    return true;
}

// Hàm để lưu điểm đánh giá của Ban cán sự
function saveBCSEvaluation(studentId, evaluationData) {
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || {};
    
    // Đảm bảo đã có đánh giá của sinh viên
    if (!evaluations[studentId] || !evaluations[studentId].studentEval) {
        console.error('Không tìm thấy đánh giá của sinh viên');
        return false;
    }
    
    // Lưu đánh giá của BCS
    evaluations[studentId].bcsEval = evaluationData;
    evaluations[studentId].status = 'pendingCVHT'; // Chờ CVHT đánh giá
    
    // Lưu trở lại localStorage
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
    
    return true;
}

// Hàm để lấy đánh giá điểm rèn luyện của một sinh viên
function getEvaluationData(studentId) {
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || {};
    return evaluations[studentId] || null;
}

// Hàm lấy danh sách sinh viên có đánh giá đang chờ xử lý
function getPendingEvaluations(role) {
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || {};
    let pendingList = [];
    
    for (let studentId in evaluations) {
        if (role === 'bcs' && evaluations[studentId].status === 'pendingBCS') {
            pendingList.push({
                studentId: studentId,
                data: evaluations[studentId]
            });
        } else if (role === 'cvht' && evaluations[studentId].status === 'pendingCVHT') {
            pendingList.push({
                studentId: studentId,
                data: evaluations[studentId]
            });
        }
    }
    
    return pendingList;
}

// Hàm để đặt thông tin người dùng hiện tại
function setCurrentUser(role, userId) {
    localStorage.setItem('currentUser', JSON.stringify({
        role: role,
        userId: userId
    }));
}

// Hàm để lấy thông tin người dùng hiện tại
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
} 