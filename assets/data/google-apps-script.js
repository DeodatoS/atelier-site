/**
 * Google Apps Script for Elisa Sanna Content Management
 * Auto-syncs Google Sheets changes to GitHub repository
 */

// 🔧 CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE', // Get from GitHub Settings → Developer settings → Personal access tokens
  GITHUB_OWNER: 'DeodatoS', // Your GitHub username
  GITHUB_REPO: 'atelier-site', // Your repository name
  GITHUB_BRANCH: 'main', // Branch to update
  NOTIFICATION_EMAIL: 'your-email@example.com', // Email for notifications
  
  // Multiple CSV files configuration
  CSV_FILES: {
    'Pages Content': 'assets/data/pages-content-template.csv',
    'Products': 'assets/data/products-template.csv'
  }
};

/**
 * 🚀 Main function - converts all sheets to CSV and uploads to GitHub
 */
function syncToGitHub() {
  try {
    console.log('🔄 Starting unified sync process...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let successCount = 0;
    let totalSheets = Object.keys(CONFIG.CSV_FILES).length;
    
    // Sync each configured sheet
    for (const [sheetName, filePath] of Object.entries(CONFIG.CSV_FILES)) {
      try {
        console.log(`📄 Processing sheet: ${sheetName}`);
        
        const sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) {
          console.log(`⚠️ Sheet "${sheetName}" not found, skipping...`);
          continue;
        }
        
        // Convert sheet to CSV
        const csvContent = sheetToCsv(sheet);
        console.log(`✅ CSV generated for ${sheetName}`);
        
        // Upload to GitHub
        const result = uploadToGitHub(csvContent, filePath);
        
        if (result.success) {
          console.log(`✅ Successfully synced ${sheetName} to GitHub`);
          successCount++;
        } else {
          console.error(`❌ Failed to sync ${sheetName}: ${result.error}`);
        }
        
      } catch (sheetError) {
        console.error(`❌ Error processing ${sheetName}:`, sheetError);
      }
    }
    
    if (successCount > 0) {
      console.log(`🎉 Sync completed! ${successCount}/${totalSheets} files updated`);
      console.log('🤖 GitHub Action will now auto-convert CSV to JSON and deploy!');
      sendNotification('✅ Content Sync Successful', `${successCount}/${totalSheets} files synced to GitHub at ${new Date()}. Auto-conversion starting...`);
    } else {
      throw new Error('No files were successfully synced');
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    sendNotification('❌ Content Sync Failed', `Error: ${error.message}`);
    throw error;
  }
}

/**
 * 📊 Converts Google Sheet to CSV format
 */
function sheetToCsv(sheet) {
  const data = sheet.getDataRange().getValues();
  
  // Convert to CSV
  const csvRows = data.map(row => {
    return row.map(cell => {
      // Handle cells that contain commas, quotes, or newlines
      let cellValue = String(cell);
      if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
        cellValue = '"' + cellValue.replace(/"/g, '""') + '"';
      }
      return cellValue;
    }).join(',');
  });
  
  return csvRows.join('\n');
}

/**
 * 🔄 Uploads CSV content to GitHub
 */
function uploadToGitHub(csvContent, filePath) {
  try {
    // First, get the current file to get its SHA (required for updates)
    const getCurrentFileUrl = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${filePath}`;
    
    const getCurrentOptions = {
      method: 'GET',
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    let currentSha = null;
    try {
      const currentResponse = UrlFetchApp.fetch(getCurrentFileUrl, getCurrentOptions);
      if (currentResponse.getResponseCode() === 200) {
        const currentData = JSON.parse(currentResponse.getContentText());
        currentSha = currentData.sha;
      }
    } catch (e) {
      console.log('File does not exist yet, will create new file');
    }
    
    // Prepare the update request
    const updateUrl = getCurrentFileUrl;
    const base64Content = Utilities.base64Encode(csvContent);
    
    const updatePayload = {
      message: `Update pages content from Google Sheets - ${new Date().toISOString()}`,
      content: base64Content,
      branch: CONFIG.GITHUB_BRANCH
    };
    
    if (currentSha) {
      updatePayload.sha = currentSha;
    }
    
    const updateOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(updatePayload)
    };
    
    // Upload to GitHub
    const response = UrlFetchApp.fetch(updateUrl, updateOptions);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200 || responseCode === 201) {
      return { success: true };
    } else {
      const errorData = JSON.parse(response.getContentText());
      return { success: false, error: errorData.message || 'Unknown GitHub API error' };
    }
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 📧 Sends notification email
 */
function sendNotification(subject, message) {
  if (CONFIG.NOTIFICATION_EMAIL && CONFIG.NOTIFICATION_EMAIL !== 'your-email@example.com') {
    try {
      GmailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, message);
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  }
}

/**
 * 🔧 Setup function - call this once to configure triggers
 */
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // Create new trigger for sheet edits
  ScriptApp.newTrigger('onSheetEdit')
    .on(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  
  console.log('✅ Triggers set up successfully');
}

/**
 * 📝 Trigger function - runs when sheet is edited
 */
function onSheetEdit(e) {
  // Add a small delay to avoid too frequent syncs
  Utilities.sleep(2000);
  
  // Only sync if the edit was in the content area (not headers)
  if (e.range.getRow() > 1) {
    syncToGitHub();
  }
}

/**
 * 🧪 Test function - use this to test the sync manually
 */
function testSync() {
  console.log('🧪 Running test sync...');
  syncToGitHub();
}

/**
 * 📋 Setup Google Sheet with proper headers
 */
function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getActiveSheet();
  
  // Rename sheet if needed
  if (CONFIG.SHEET_NAME && sheet.getName() !== CONFIG.SHEET_NAME) {
    sheet.setName(CONFIG.SHEET_NAME);
  }
  
  // Set up headers
  const headers = [
    'page_id',
    'section_id', 
    'content_type',
    'title',
    'subtitle',
    'description',
    'image_url',
    'image_alt',
    'order_position',
    'is_active'
  ];
  
  // Clear existing content and set headers
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  sheet.setColumnWidth(6, 300); // description column wider
  sheet.setColumnWidth(7, 300); // image_url column wider
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log('✅ Sheet setup completed');
}

/**
 * 📊 Import existing CSV data to sheet
 */
function importExistingCsv() {
  try {
    // Get current CSV from GitHub
    const getCurrentFileUrl = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.FILE_PATH}`;
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    const response = UrlFetchApp.fetch(getCurrentFileUrl, options);
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      const csvContent = Utilities.base64Decode(data.content);
      const csvText = Utilities.newBlob(csvContent).getDataAsString();
      
      // Parse CSV and populate sheet
      const rows = csvText.split('\n').map(row => {
        // Simple CSV parsing - might need enhancement for complex content
        return row.split(',');
      });
      
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      if (rows.length > 0) {
        sheet.clear();
        sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
        
        // Format headers
        const headerRange = sheet.getRange(1, 1, 1, rows[0].length);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#4285f4');
        headerRange.setFontColor('white');
        
        console.log('✅ CSV data imported successfully');
      }
    } else {
      console.log('No existing CSV found, starting fresh');
    }
    
  } catch (error) {
    console.error('Failed to import CSV:', error);
  }
}
