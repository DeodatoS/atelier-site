/**
 * Google Apps Script for Elisa Sanna PRODUCTS Management
 * Simple and reliable version
 * 
 * UTF-8 Support: This script properly handles accented characters (à, è, ì, ò, ù, etc.)
 * and special characters in CSV/JSON files for correct display on the website.
 */

// 🔧 CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE', // Get from GitHub Settings → Developer settings → Personal access tokens
  GITHUB_OWNER: 'DeodatoS', // Your GitHub username
  GITHUB_REPO: 'atelier-site', // Your repository name
  GITHUB_BRANCH: 'main', // Branch to update
  NOTIFICATION_EMAIL: 'your-email@example.com', // Email for notifications
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
 * 🧪 Test GitHub connection
 */
function testGitHubConnection() {
  try {
    console.log('🧪 Testing GitHub connection...');
    
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}`;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GoogleAppsScript-ProductsSync'
      }
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log('🧪 GitHub API response:', responseCode);
    console.log('🧪 Response text:', responseText);
    
    if (responseCode === 200) {
      console.log('✅ GitHub connection successful');
      return true;
    } else {
      console.log('❌ GitHub connection failed');
      return false;
    }
    
  } catch (error) {
    console.error('❌ GitHub connection test failed:', error);
    return false;
  }
}

/**
 * 🚀 Main function - converts products sheet to CSV and JSON, uploads to GitHub
 */
function syncProductsToGitHub() {
  try {
    console.log('🔄 Starting products sync process...');
    console.log('🔧 Config check:', {
      owner: CONFIG.GITHUB_OWNER,
      repo: CONFIG.GITHUB_REPO,
      branch: CONFIG.GITHUB_BRANCH,
      sheetName: CONFIG.SHEET_NAME,
      hasToken: !!CONFIG.GITHUB_TOKEN && CONFIG.GITHUB_TOKEN !== 'YOUR_GITHUB_TOKEN_HERE'
    });
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${CONFIG.SHEET_NAME}" not found!`);
    }
    
    // Convert sheet to CSV
    const csvContent = sheetToCsv(sheet);
    console.log('✅ Products CSV generated');
    
    // Upload CSV to GitHub
    const csvResult = uploadToGitHub(csvContent, 'assets/data/products-template.csv');
    
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
    console.error('❌ Error details:', error.stack);
    sendNotification('❌ Products Sync Failed', `Error: ${error.toString()}\n\nStack: ${error.stack}`);
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
    
    // Convert to CSV with proper escaping and UTF-8 handling
    const csvRows = data.map(row => 
      row.map(cell => {
        // Convert to string and handle special characters
        let cellValue = String(cell || '');
        
        // Ensure proper UTF-8 encoding for accented characters
        cellValue = cellValue.replace(/[\u00C0-\u017F]/g, function(match) {
          return match; // Keep accented characters as-is for UTF-8
        });
        
        // Escape quotes and wrap in quotes if contains comma, quote, newline, or accented characters
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n') || /[\u00C0-\u017F]/.test(cellValue)) {
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
        'description': 'Abiti ricamati a mano, simbolo di eleganza autentica'
      },
      'collections': {
        'name': 'Collections',
        'description': 'Abiti ricamati a mano, simbolo di eleganza autentica'
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
    
    // Prepare commit data with proper UTF-8 encoding
    const commitData = {
      message: filePath.includes('.json') ? 
        `Auto-convert products CSV to JSON - ${new Date().toISOString()}` :
        `Update products CSV from Google Sheets - ${new Date().toISOString()}`,
      content: Utilities.base64Encode(Utilities.newBlob(content, 'text/plain; charset=utf-8').getBytes()),
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
