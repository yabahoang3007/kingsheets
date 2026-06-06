function doGet() {
  return HtmlService.createTemplateFromFile('index_gas').evaluate()
    .setTitle('Kingsheets — Chuyển dữ liệu lớn thành quyết định thông minh')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
