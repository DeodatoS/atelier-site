/**
 * Google Apps Script for Elisa Sanna PRODUCTS Management
 * Auto-syncs Google Sheets changes to GitHub repository
 * SEPARATE SYSTEM from pages content management
 */

// 🔧 CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE', // Get from GitHub Settings → Developer settings → Personal access tokens
  GITHUB_OWNER: 'DeodatoS', // Your GitHub username
  GITHUB_REPO: 'atelier-site', // Your repository name
  GITHUB_BRANCH: 'main', // Branch to update
  NOTIFICATION_EMAIL: 'your-email@example.com', // Email for notifications
  
  // Single CSV file for products only
  CSV_FILE_PATH: 'assets/data/products-template.csv',
  SHEET_NAME: 'Products'
};

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
    
    // Upload to GitHub
    const result = uploadToGitHub(csvContent);
    
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
      content: Utilities.base64Encode(csvContent),
      branch: CONFIG.GITHUB_BRANCH
    };
    
    if (sha) {
      commitData.sha = sha;
    }
    
    console.log('🚀 Uploading products to GitHub...');
    
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
      console.log('✅ Products file uploaded successfully');
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

/**
 * 🔄 Setup the products sheet with headers and sample data
 */
function setupProductsSheet() {
  try {
    console.log('🔧 Setting up products sheet...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet;
    
    // Get or create sheet
    try {
      sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
        console.log('📄 Created new products sheet');
      }
    } catch (error) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      console.log('📄 Created new products sheet');
    }
    
    // Clear existing content
    sheet.clear();
    
    // Import existing products CSV from GitHub
    importExistingProductsCsv(sheet);
    
    console.log('✅ Products sheet setup completed');
    return sheet;
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}

/**
 * 📥 Import existing products CSV from GitHub
 */
function importExistingProductsCsv(sheet) {
  try {
    console.log('📥 Importing existing products CSV from GitHub...');
    
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.CSV_FILE_PATH}`;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GoogleAppsScript-ProductsSync'
      }
    });
    
    if (response.getResponseCode() === 200) {
      const fileData = JSON.parse(response.getContentText());
      const csvContent = Utilities.newBlob(Utilities.base64Decode(fileData.content)).getDataAsString();
      
      console.log('📄 Products CSV downloaded from GitHub');
      
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
        console.log(`✅ Imported ${paddedData.length} rows of products data`);
      }
      
    } else {
      console.log('⚠️ Products CSV not found on GitHub, creating sample data...');
      populateWithSampleProductsData(sheet);
    }
    
  } catch (error) {
    console.log('⚠️ Failed to import products CSV, creating sample data:', error);
    populateWithSampleProductsData(sheet);
  }
}

/**
 * 📝 Populate sheet with sample products data
 */
function populateWithSampleProductsData(sheet) {
  console.log('📝 Creating sample products data...');
  
  const sampleData = [
    ['id', 'name', 'category', 'subcategory', 'description', 'price', 'images', 'features', 'care_instructions', 'material'],
    ['dress-001', 'Elegant Evening Dress', 'private_ceremonial', 'dresses', 'A stunning evening dress perfect for special occasions', '1200', 'dress-001-1.jpg,dress-001-2.jpg', 'Hand-embroidered details,Premium silk fabric', 'Dry clean only', 'Silk'],
    ['jacket-002', 'Tailored Blazer', 'collections', 'jackets', 'A sophisticated blazer for the modern woman', '800', 'jacket-002-1.jpg', 'Classic cut,Italian tailoring', 'Dry clean recommended', 'Wool blend'],
    ['coat-003', 'Winter Coat', 'collections', 'outerwear', 'Luxurious winter coat with premium materials', '1500', 'coat-003-1.jpg,coat-003-2.jpg', 'Cashmere lining,Handcrafted buttons', 'Professional cleaning only', 'Cashmere']
  ];
  
  sheet.getRange(1, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  console.log('✅ Sample products data created');
}

/**
 * ⚙️ Setup automatic triggers for products sheet
 */
function setupProductsTriggers() {
  try {
    console.log('⚙️ Setting up products triggers...');
    
    // Delete existing triggers for this script
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'syncProductsToGitHub') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create manual trigger setup message
    console.log('📝 Manual trigger setup required:');
    console.log('1. Go to Apps Script Editor');
    console.log('2. Click on the trigger icon (clock/alarm)');
    console.log('3. Click "Add Trigger"');
    console.log('4. Choose function: syncProductsToGitHub');
    console.log('5. Choose event source: From spreadsheet');
    console.log('6. Choose event type: On edit');
    console.log('7. Save the trigger');
    
    return '✅ Manual trigger setup instructions provided. Please set up the trigger manually in the Apps Script editor.';
    
  } catch (error) {
    console.error('❌ Error setting up triggers:', error);
    return `❌ Error setting up triggers: ${error.toString()}`;
  }
}

// 🎯 PRODUCTS-ONLY AUTO-INITIALIZATION
console.log('🚀 Products Google Apps Script loaded');
console.log('📋 Available functions:');
console.log('  - setupProductsSheet(): Setup products sheet with data');
console.log('  - syncProductsToGitHub(): Sync products to GitHub manually');
console.log('  - setupProductsTriggers(): Setup automatic sync triggers');
