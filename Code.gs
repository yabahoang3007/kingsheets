function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data  = JSON.parse(e.postData.contents);

  // Header row
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Thời gian', 'Tên', 'Điện thoại', 'Nhu cầu (loại)', 'Mô tả thêm',
      'Mã khuyến mại', 'Ưu đãi áp dụng',
      'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'URL nguồn'
    ]);
  }

  const promoLabels = {
    'KING20':   'Giảm 20% dự án đầu tiên',
    'KING30':   'Giảm 30% (ưu đãi đặc biệt)',
    'FB10':     'Giảm 10% — Facebook Ads',
    'GOOGLE15': 'Giảm 15% — Google Ads',
  };
  const code       = (data.promo_code || '').toUpperCase();
  const promoLabel = code ? (promoLabels[code] || 'Mã không rõ: ' + code) : '';

  sheet.appendRow([
    new Date(),
    data.name         || '',
    data.phone        || '',
    data.need_type    || '',
    data.need         || '',
    code,
    promoLabel,
    data.utm_source   || '',
    data.utm_medium   || '',
    data.utm_campaign || '',
    data.utm_content  || '',
    data.source_url   || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'KingSheets API running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
