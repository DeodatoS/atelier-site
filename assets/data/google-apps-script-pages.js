/**
 * Google Apps Script for Elisa Sanna PAGES Content Management
 * Auto-syncs Google Sheets changes to GitHub repository
 * SEPARATE SYSTEM from products management
 */

// 🔧 CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE', // Get from GitHub Settings → Developer settings → Personal access tokens
  GITHUB_OWNER: 'DeodatoS', // Your GitHub username
  GITHUB_REPO: 'atelier-site', // Your repository name
  GITHUB_BRANCH: 'main', // Branch to update
  NOTIFICATION_EMAIL: 'your-email@example.com', // Email for notifications
  
  // Single CSV file for pages only
  CSV_FILE_PATH: 'assets/data/pages-content-template.csv',
  SHEET_NAME: 'Pages Content'
};

/**
 * 🎯 Setup custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Elisa Sanna - Pagine')
    .addItem('📤 Pubblica Pagine sul Sito', 'syncPagesToGitHub')
    .addSeparator()
    .addItem('ℹ️ Info Sistema', 'showSystemInfo')
    .addToUi();
  
  console.log('✅ Menu pagine aggiunto alla barra superiore');
}

/**
 * 📋 Show system information
 */
function showSystemInfo() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🚀 Sistema Pagine Elisa Sanna',
    '📤 Clicca "Pubblica Pagine sul Sito" per aggiornare il sito web\n\n' +
    '⏱️ Il sistema ora pubblica SOLO quando richiesto\n' +
    '✅ Modifica tutti i contenuti che vuoi, poi pubblica una volta sola\n\n' +
    '🔄 Tempo di aggiornamento: 2-3 minuti',
    ui.ButtonSet.OK
  );
}

/**
 * 🚀 Main function - converts pages sheet to CSV and uploads to GitHub
 */
function syncPagesToGitHub() {
  try {
    console.log('🔄 Starting pages sync process...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${CONFIG.SHEET_NAME}" not found!`);
    }
    
    // Convert sheet to CSV
    const csvContent = sheetToCsv(sheet);
    console.log('✅ Pages CSV generated');
    
    // Upload to GitHub
    const result = uploadToGitHub(csvContent);
    
    if (result.success) {
      console.log('✅ Pages successfully synced to GitHub!');
      sendNotification('✅ Pages Updated', 'Pages content has been successfully updated on the website.');
    } else {
      throw new Error(`GitHub upload failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Pages sync failed:', error);
    sendNotification('❌ Pages Sync Failed', `Error: ${error.toString()}`);
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
    
    console.log(`📊 Processing ${data.length} rows from pages sheet`);
    
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
 * 🚀 Upload CSV content to GitHub
 */
function uploadToGitHub(csvContent) {
  try {
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.CSV_FILE_PATH}`;
    
    console.log('🔍 Checking current file on GitHub...');
    
    // Get current file SHA (if exists)
    let sha = null;
    try {
      const getResponse = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GoogleAppsScript-PagesSync'
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
      message: `Update pages content from Google Sheets - ${new Date().toISOString()}`,
      content: Utilities.base64Encode(csvContent),
      branch: CONFIG.GITHUB_BRANCH
    };
    
    if (sha) {
      commitData.sha = sha;
    }
    
    console.log('🚀 Uploading pages to GitHub...');
    
    // Upload to GitHub
    const response = UrlFetchApp.fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GoogleAppsScript-PagesSync'
      },
      payload: JSON.stringify(commitData)
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200 || responseCode === 201) {
      console.log('✅ Pages file uploaded successfully');
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
        subject: `[Elisa Sanna Pages] ${subject}`,
        body: `${message}\n\nTime: ${new Date().toString()}\nSheet: Pages Content Management`
      });
      console.log('📧 Notification sent');
    }
  } catch (error) {
    console.log('⚠️ Could not send notification:', error);
  }
}

/**
 * 🔄 Setup the pages sheet with headers and sample data
 */
function setupPagesSheet() {
  try {
    console.log('🔧 Setting up pages sheet...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet;
    
    // Get or create sheet
    try {
      sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
        console.log('📄 Created new pages sheet');
      }
    } catch (error) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      console.log('📄 Created new pages sheet');
    }
    
    // Clear existing content
    sheet.clear();
    
    // Import existing pages CSV from GitHub
    importExistingPagesCsv(sheet);
    
    console.log('✅ Pages sheet setup completed');
    return sheet;
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}

/**
 * 📥 Import existing pages CSV from GitHub
 */
function importExistingPagesCsv(sheet) {
  try {
    console.log('📥 Importing existing pages CSV from GitHub...');
    
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.CSV_FILE_PATH}`;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GoogleAppsScript-PagesSync'
      }
    });
    
    if (response.getResponseCode() === 200) {
      const fileData = JSON.parse(response.getContentText());
      const csvContent = Utilities.newBlob(Utilities.base64Decode(fileData.content)).getDataAsString();
      
      console.log('📄 Pages CSV downloaded from GitHub');
      
      // Parse CSV and populate sheet
      const lines = csvContent.split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing (handles basic cases)
        const cells = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            cells.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        cells.push(current); // Add the last cell
        
        return cells;
      }).filter(row => row.some(cell => cell.trim() !== ''));
      
      if (data.length > 0) {
        const maxCols = Math.max(...data.map(row => row.length));
        const paddedData = data.map(row => {
          while (row.length < maxCols) row.push('');
          return row;
        });
        
        sheet.getRange(1, 1, paddedData.length, maxCols).setValues(paddedData);
        console.log(`✅ Imported ${paddedData.length} rows of pages data`);
      }
      
    } else {
      console.log('⚠️ Pages CSV not found on GitHub, creating sample data...');
      populateWithSamplePagesData(sheet);
    }
    
  } catch (error) {
    console.log('⚠️ Failed to import pages CSV, creating sample data:', error);
    populateWithSamplePagesData(sheet);
  }
}

/**
 * 📝 Populate sheet with sample pages data
 */
function populateWithSamplePagesData(sheet) {
  console.log('📝 Creating sample pages data...');
  
  const sampleData = [
    ['page_id', 'section_type', 'element_id', 'title', 'subtitle', 'description', 'image_url', 'button_text', 'button_link', 'additional_data'],
    ['home', 'hero', 'hero-section', 'Atelier Elisa Sanna', 'Handcrafted Excellence', 'Where tradition meets innovation in bespoke Italian fashion.', 'assets/images/hero-home.jpg', 'Discover Our Collections', 'pages/collections.html', ''],
    ['our-atelier', 'hero', 'hero-section', 'Our Atelier', 'Where Magic Happens', 'Step inside our world where traditional Italian craftsmanship meets contemporary design.', 'assets/images/atelier-hero.jpg', '', '', ''],
    ['hand-embroidery', 'hero', 'hero-section', 'Hand Embroidery', 'Artistry in Every Thread', 'Discover the ancient art of hand embroidery, where each stitch tells a story.', 'assets/images/embroidery-hero.jpg', '', '', '']
  ];
  
  sheet.getRange(1, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  console.log('✅ Sample pages data created');
}

/**
 * 🧹 Clean up any old triggers (optional maintenance function)
 */
function removeOldTriggers() {
  try {
    console.log('🧹 Cleaning up old triggers...');
    
    const triggers = ScriptApp.getProjectTriggers();
    let removedCount = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'syncPagesToGitHub' || 
          trigger.getHandlerFunction() === 'syncToGitHub' ||
          trigger.getHandlerFunction() === 'onSheetEdit') {
        ScriptApp.deleteTrigger(trigger);
        removedCount++;
      }
    });
    
    console.log(`✅ Removed ${removedCount} old triggers`);
    return `✅ Removed ${removedCount} old triggers`;
    
  } catch (error) {
    console.error('❌ Error removing triggers:', error);
    return `❌ Error: ${error.toString()}`;
  }
}

// 🎯 PAGES-ONLY MANUAL SYNC SYSTEM
console.log('🚀 Pages Google Apps Script loaded - Manual Sync Mode');
console.log('📋 Available functions:');
console.log('  - setupPagesSheet(): Setup pages sheet with data');
console.log('  - syncPagesToGitHub(): Publish pages to website (use menu button)');
console.log('  - removeOldTriggers(): Clean up old automatic triggers');
console.log('');
console.log('🎯 NEW: Use the menu "🚀 Elisa Sanna - Pagine" → "📤 Pubblica Pagine sul Sito"');
