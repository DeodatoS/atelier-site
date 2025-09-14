/**
 * Google Apps Script for Elisa Sanna PRODUCTS Management
 * Ultra-simple working version
 */

// 🔧 CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE',
  GITHUB_OWNER: 'DeodatoS',
  GITHUB_REPO: 'atelier-site',
  GITHUB_BRANCH: 'main',
  NOTIFICATION_EMAIL: 'your-email@example.com',
  SHEET_NAME: 'Products'
};

/**
 * 🎯 Setup custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Elisa Sanna - Prodotti')
    .addItem('📤 Pubblica Prodotti sul Sito', 'syncProductsToGitHub')
    .addSeparator()
    .addItem('ℹ️ Info Sistema', 'showSystemInfo')
    .addToUi();
}

/**
 * 📋 Show system information
 */
function showSystemInfo() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🚀 Sistema Prodotti Elisa Sanna',
    '📤 Clicca "Pubblica Prodotti sul Sito" per aggiornare il sito web\n\n' +
    '🔄 Tempo di aggiornamento: 1-2 minuti',
    ui.ButtonSet.OK
  );
}

/**
 * 🚀 Main function - converts products sheet to CSV and uploads to GitHub
 */
function syncProductsToGitHub() {
  try {
    console.log('🔄 Starting products sync process...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${CONFIG.SHEET_NAME}" not found!`);
    }
    
    // Convert sheet to CSV
    const csvContent = sheetToCsv(sheet);
    console.log('✅ Products CSV generated');
    
    // Upload CSV to GitHub
    const result = uploadToGitHub(csvContent, 'assets/data/products-template.csv');
    
    if (result.success) {
      console.log('✅ Products successfully synced to GitHub!');
      sendNotification('✅ Products Updated', 'Products data has been successfully updated on the website.');
    } else {
      throw new Error(`GitHub upload failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Products sync failed:', error);
    sendNotification('❌ Products Sync Failed', `Error: ${error.toString()}`);
    throw error;
  }
}

/**
 * 📊 Convert sheet data to CSV format
 */
function sheetToCsv(sheet) {
  try {
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      throw new Error('Sheet is empty');
    }
    
    console.log(`📊 Processing ${data.length} rows from products sheet`);
    
    // Convert to CSV with proper escaping
    const csvRows = data.map(row => 
      row.map(cell => {
        // Convert to string and handle special characters
        let cellValue = String(cell || '');
        
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          cellValue = '"' + cellValue.replace(/"/g, '""') + '"';
        }
        
        return cellValue;
      }).join(',')
    );
    
    return csvRows.join('\n');
    
  } catch (error) {
    console.error('❌ Error converting sheet to CSV:', error);
    throw error;
  }
}

/**
 * 🚀 Upload content to GitHub
 */
function uploadToGitHub(content, filePath) {
  try {
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${filePath}`;
    
    console.log('🔍 Checking current file on GitHub...');
    
    // Get current file SHA (if exists)
    let sha = null;
    try {
      const getResponse = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GoogleAppsScript-ProductsSync'
        }
      });
      
      if (getResponse.getResponseCode() === 200) {
        const fileData = JSON.parse(getResponse.getContentText());
        sha = fileData.sha;
        console.log('📄 Found existing file, will update');
      }
    } catch (e) {
      console.log('📄 File does not exist, will create new');
    }
    
    // Prepare commit data
    const commitData = {
      message: `Update products from Google Sheets - ${new Date().toISOString()}`,
      content: Utilities.base64Encode(content),
      branch: CONFIG.GITHUB_BRANCH
    };
    
    if (sha) {
      commitData.sha = sha;
    }
    
    console.log('🚀 Uploading to GitHub...');
    
    // Upload to GitHub
    const response = UrlFetchApp.fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GoogleAppsScript-ProductsSync'
      },
      payload: JSON.stringify(commitData)
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200 || responseCode === 201) {
      console.log('✅ File uploaded successfully');
      return { success: true };
    } else {
      console.error('❌ GitHub API error:', responseCode, responseText);
      return { success: false, error: `HTTP ${responseCode}: ${responseText}` };
    }
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * 📧 Send notification email
 */
function sendNotification(subject, message) {
  try {
    if (CONFIG.NOTIFICATION_EMAIL && CONFIG.NOTIFICATION_EMAIL !== 'your-email@example.com') {
      MailApp.sendEmail({
        to: CONFIG.NOTIFICATION_EMAIL,
        subject: `[Elisa Sanna Products] ${subject}`,
        body: `${message}\n\nTime: ${new Date().toString()}\nSheet: Products Management`
      });
      console.log('📧 Notification sent');
    }
  } catch (error) {
    console.log('⚠️ Could not send notification:', error);
  }
}

console.log('🚀 Products Google Apps Script loaded - Ready to sync!');



