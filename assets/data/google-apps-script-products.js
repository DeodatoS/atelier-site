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
 * 🎯 Setup custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Elisa Sanna - Prodotti')
    .addItem('📤 Pubblica Prodotti sul Sito', 'syncProductsToGitHub')
    .addSeparator()
    .addItem('ℹ️ Info Sistema', 'showSystemInfo')
    .addToUi();
  
  console.log('✅ Menu prodotti aggiunto alla barra superiore');
}

/**
 * 📋 Show system information
 */
function showSystemInfo() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🚀 Sistema Prodotti Elisa Sanna',
    '📤 Clicca "Pubblica Prodotti sul Sito" per aggiornare il sito web\n\n' +
    '🚀 SISTEMA COMPLETAMENTE AUTOMATICO\n' +
    '✅ CSV → JSON → Sito Web (tutto in un click)\n' +
    '✅ Modifica tutti i prodotti che vuoi, poi pubblica una volta sola\n\n' +
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
    const csvResult = uploadToGitHub(csvContent, CONFIG.CSV_FILE_PATH);
    
    if (csvResult.success) {
      console.log('✅ Products CSV successfully synced to GitHub!');
      
      // Convert CSV to JSON and upload JSON as well
      const jsonContent = convertCsvToJson(csvContent);
      const jsonResult = uploadToGitHub(jsonContent, 'assets/data/products.json');
      
      if (jsonResult.success) {
        console.log('✅ Products JSON successfully synced to GitHub!');
        sendNotification('✅ Products Updated', 'Products data (CSV + JSON) has been successfully updated on the website.');
      } else {
        console.log('⚠️ JSON upload failed, but CSV was successful');
        sendNotification('⚠️ Partial Update', 'Products CSV updated, but JSON conversion failed.');
      }
    } else {
      throw new Error(`GitHub upload failed: ${csvResult.error}`);
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
      message: filePath.includes('.json') ? 
        `Auto-convert products CSV to JSON - ${new Date().toISOString()}` :
        `Update products CSV from Google Sheets - ${new Date().toISOString()}`,
      content: Utilities.base64Encode(content),
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
 * 🔄 Convert CSV content to JSON format
 */
function convertCsvToJson(csvContent) {
  try {
    console.log('🔄 Converting CSV to JSON...');
    
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Category information
    const categoryInfo = {
      'prive_ceremonial': {
        'name': 'Couture e Cerimonia',
        'description': 'Exquisite pieces for special occasions and refined experiences'
      },
      'collections': {
        'name': 'Collections',
        'description': 'Curated seasonal collections showcasing contemporary Italian elegance'
      },
      'kids': {
        'name': 'Kids',
        'description': 'Ricami e texture che raccontano un\'eleganza autentica'
      }
    };
    
    const productsByCategory = {};
    
    // Parse CSV rows (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV parsing
      const cells = parseCsvLine(line);
      if (cells.length < headers.length) continue;
      
      const row = {};
      headers.forEach((header, index) => {
        row[header] = cells[index] || '';
      });
      
      // Skip empty rows
      if (!row.id || !row.name || !row.image) continue;
      
      // Convert prices
      const prices = {
        standard: parseInt(row.prices_standard) || 0,
        minimum: parseInt(row.prices_minimum) || 0,
        maximum: parseInt(row.prices_maximum) || 0
      };
      
      // Convert comma-separated lists
      const colors = row.colors ? row.colors.split(',').map(c => c.trim()) : [];
      const sizes = row.sizes ? row.sizes.split(',').map(s => s.trim()) : [];
      
      // Build gallery array
      const gallery = [row.image];
      if (row.image_2 && row.image_2.trim()) gallery.push(row.image_2);
      if (row.image_3 && row.image_3.trim()) gallery.push(row.image_3);
      
      // Create product object
      const product = {
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        image: row.image,
        image_2: row.image_2 || '',
        image_3: row.image_3 || '',
        video_url: row.video_url || '',
        gallery: gallery,
        prices: prices,
        colors: colors,
        sizes: sizes,
        fabric: row.fabric,
        madeTo: row.madeTo
      };
      
      // Add to category
      if (!productsByCategory[row.category]) {
        productsByCategory[row.category] = [];
      }
      productsByCategory[row.category].push(product);
    }
    
    // Create final JSON structure
    const jsonStructure = {
      categories: {}
    };
    
    for (const category in productsByCategory) {
      jsonStructure.categories[category] = {
        name: categoryInfo[category] ? categoryInfo[category].name : category,
        description: categoryInfo[category] ? categoryInfo[category].description : '',
        products: productsByCategory[category]
      };
    }
    
    const jsonContent = JSON.stringify(jsonStructure, null, 2);
    console.log(`✅ Converted ${Object.keys(productsByCategory).length} categories to JSON`);
    
    return jsonContent;
    
  } catch (error) {
    console.error('❌ Error converting CSV to JSON:', error);
    throw error;
  }
}

/**
 * 📝 Parse CSV line with proper quote handling
 */
function parseCsvLine(line) {
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
 * 🧹 Clean up any old triggers (optional maintenance function)
 */
function removeOldTriggers() {
  try {
    console.log('🧹 Cleaning up old triggers...');
    
    const triggers = ScriptApp.getProjectTriggers();
    let removedCount = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'syncProductsToGitHub') {
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

// 🎯 PRODUCTS-ONLY MANUAL SYNC SYSTEM
console.log('🚀 Products Google Apps Script loaded - Manual Sync Mode');
console.log('📋 Available functions:');
console.log('  - setupProductsSheet(): Setup products sheet with data');
console.log('  - syncProductsToGitHub(): Publish products to website (use menu button)');
console.log('  - removeOldTriggers(): Clean up old automatic triggers');
console.log('');
console.log('🎯 NEW: Use the menu "🚀 Elisa Sanna - Prodotti" → "📤 Pubblica Prodotti sul Sito"');
