// ============================================================
// KingSheets — Google Apps Script
// Ghi dữ liệu form vào Google Sheets
//
// Cách deploy:
//   1. Mở script tại: script.google.com
//   2. Dán toàn bộ code này vào
//   3. Thay SPREADSHEET_ID bằng ID sheet của bạn
//   4. Deploy > New deployment > Web app
//      - Execute as: Me
//      - Who has access: Anyone
//   5. Copy URL và dán vào SHEET_URL trong script.js
// ============================================================

// === CÀI ĐẶT ===
const SPREADSHEET_ID = '1vCY5YKEq1gT0OWUCHBsDteEdiB42Y0NZ8rt0YafJQP0';
const SHEET_NAME     = 'Leads';

// Các cột theo thứ tự (phải khớp với header row trong sheet)
const COLUMNS = [
  'timestamp',
  'name',
  'phone',
  'need_type',
  'need',
  'promo_code',
  'promo_label',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'source_url',
];

// === XỬ LÝ POST REQUEST ===
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet(ss, SHEET_NAME);

    // Tạo header row nếu sheet còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length)
           .setFontWeight('bold')
           .setBackground('#1a2e4a')
           .setFontColor('#e8a918');
    }

    // Xác định label của mã promo
    const promoLabel = resolvePromoLabel(data.promo_code);

    // Ghi dữ liệu theo thứ tự COLUMNS
    const row = COLUMNS.map(col => {
      if (col === 'timestamp')   return new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      if (col === 'promo_label') return promoLabel;
      return data[col] || '';
    });

    sheet.appendRow(row);

    return jsonResponse({ status: 'ok', message: 'Saved' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() }, 500);
  }
}

// === XỬ LÝ GET REQUEST (test ping) ===
function doGet() {
  return jsonResponse({ status: 'ok', message: 'KingSheets API is running' });
}

// === HELPER: Tra cứu label từ mã promo ===
function resolvePromoLabel(code) {
  if (!code) return '';
  const promos = {
    'KING20': 'Giảm 20% dự án đầu tiên',
    'KING30': 'Giảm 30% (ưu đãi đặc biệt)',
    'FB10':   'Giảm 10% — traffic Facebook Ads',
    'GOOGLE15': 'Giảm 15% — traffic Google Ads',
    // Thêm mã mới vào đây
  };
  return promos[code.toUpperCase()] || `Mã không rõ: ${code}`;
}

// === HELPER: Tạo sheet nếu chưa có ===
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// === HELPER: Trả về JSON response ===
function jsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
