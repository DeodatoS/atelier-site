# Products Management Guide

This folder contains the product data and tools for managing the Elisa Sanna website catalog.

## Files Overview

- `products.json` - Main products database used by the website
- `products-template.csv` - Excel-friendly template for editing products
- `csv-to-json-converter.py` - Tool to convert CSV back to JSON
- `README.md` - This documentation

## How to Manage Products

### Option 1: Direct JSON Editing (Technical Users)
Edit `products.json` directly using any text editor. The structure is:

```json
{
  "categories": {
    "category_key": {
      "name": "Display Name",
      "description": "Category description",
      "products": [
        {
          "id": "unique_id",
          "name": "Product Name",
          "category": "category_key",
          "description": "Product description",
          "image": "https://image-url.com/image.jpg",
          "gallery": ["https://image1.jpg", "https://image2.jpg"],
          "prices": {
            "standard": 1000,
            "minimum": 800,
            "maximum": 1200
          },
          "colors": ["Color 1", "Color 2"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "Fabric description",
          "madeTo": "measure" or "order"
        }
      ]
    }
  }
}
```

### Option 2: Excel/CSV Editing (Recommended for Non-Technical Users)

1. **Export to CSV** (if needed):
   - Use an online JSON to CSV converter
   - Or ask a developer to create a current CSV export

2. **Edit in Excel**:
   - Use `products-template.csv` as a starting point
   - Columns:
     - `id`: Unique product identifier (e.g., pc001, col001, kid001)
     - `name`: Product name
     - `category`: Must be one of: `prive_ceremonial`, `collections`, `kids`
     - `description`: Product description
     - `image`: Full URL to product image
     - `prices_standard`: Standard price in euros (no currency symbol)
     - `prices_minimum`: Minimum price
     - `prices_maximum`: Maximum price
     - `colors`: Comma-separated list (e.g., "Black,White,Navy")
     - `sizes`: Comma-separated list (e.g., "XS,S,M,L,XL")
     - `fabric`: Fabric description
     - `madeTo`: Either "measure" or "order"

3. **Convert back to JSON**:
   ```bash
   python csv-to-json-converter.py your-products.csv products.json
   ```

## Category Keys
- `prive_ceremonial` → "Privé & Ceremonial"
- `collections` → "Collections"  
- `kids` → "Kids"

## Image Guidelines
- Use high-quality images (minimum 800x800px)
- Prefer HTTPS URLs
- Unsplash images are good for placeholders
- For production, upload images to your hosting and use those URLs

## Price Guidelines
- All prices in euros (€)
- Use whole numbers (no decimals)
- Standard price is the main display price
- Minimum/Maximum define the customization range

## Color Names
Use descriptive names that customers understand:
- ✅ Good: "Midnight Black", "Ivory", "Dusty Rose"
- ❌ Avoid: "#000000", "Color1", abbreviations

## Size Guidelines
### Adult sizes: XS, S, M, L, XL, XXL
### Kids sizes: 2Y, 3Y, 4Y, 5Y, 6Y, 7Y, 8Y, 10Y, 12Y, 14Y

## Testing Changes
1. Save your `products.json` file
2. Refresh the website
3. Navigate to product categories to test
4. Check filters work correctly

## Backup
Always keep a backup of your working `products.json` before making changes.

## Support
For technical issues or questions about the product management system, contact your web developer.
