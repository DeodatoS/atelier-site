#!/usr/bin/env python3
"""
CSV to JSON Converter for Elisa Sanna Products
Usage: python csv-to-json-converter.py input.csv output.json
"""

import csv
import json
import sys
from collections import defaultdict

def convert_csv_to_json(csv_file, json_file):
    products_by_category = defaultdict(list)
    
    # Category information
    category_info = {
        'prive_ceremonial': {
            'name': 'Couture e Cerimonia',
            'description': 'Exquisite pieces for special occasions and refined experiences'
        },
        'collections': {
            'name': 'Collezioni', 
            'description': 'Curated seasonal collections showcasing contemporary Italian elegance'
        },
        'kids': {
            'name': 'Kids',
            'description': 'Ricami e texture che raccontano un\'eleganza autentica'
        }
    }
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # Skip empty rows or rows without essential data
                if not row.get('id') or not row.get('name') or not row.get('image'):
                    continue
                    
                # Convert prices to integers
                try:
                    prices = {
                        'standard': int(row['prices_standard']) if row['prices_standard'] else 0,
                        'minimum': int(row['prices_minimum']) if row['prices_minimum'] else 0,
                        'maximum': int(row['prices_maximum']) if row['prices_maximum'] else 0
                    }
                except ValueError:
                    print(f"⚠️ Skipping row with invalid price data: {row.get('id', 'unknown')}")
                    continue
                
                # Convert comma-separated lists
                colors = [color.strip() for color in row['colors'].split(',')]
                sizes = [size.strip() for size in row['sizes'].split(',')]
                
                # Build gallery array with all available images
                gallery = [row['image']]  # Main image always first
                if row.get('image_2') and row['image_2'].strip():
                    gallery.append(row['image_2'])
                if row.get('image_3') and row['image_3'].strip():
                    gallery.append(row['image_3'])
                
                # Create product object
                product = {
                    'id': row['id'],
                    'name': row['name'],
                    'category': row['category'],
                    'description': row['description'],
                    'image': row['image'],
                    'image_2': row.get('image_2', ''),
                    'image_3': row.get('image_3', ''),
                    'video_url': row.get('video_url', ''),
                    'gallery': gallery,
                    'prices': prices,
                    'colors': colors,
                    'sizes': sizes,
                    'fabric': row['fabric'],
                    'madeTo': row['madeTo']
                }
                
                products_by_category[row['category']].append(product)
        
        # Create final JSON structure
        json_structure = {
            'categories': {}
        }
        
        for category, products in products_by_category.items():
            json_structure['categories'][category] = {
                'name': category_info.get(category, {}).get('name', category.title()),
                'description': category_info.get(category, {}).get('description', ''),
                'products': products
            }
        
        # Write to JSON file
        with open(json_file, 'w', encoding='utf-8') as file:
            json.dump(json_structure, file, indent=2, ensure_ascii=False)
        
        print(f"✅ Successfully converted {csv_file} to {json_file}")
        print(f"📊 Total products: {sum(len(products) for products in products_by_category.values())}")
        print(f"📁 Categories: {list(products_by_category.keys())}")
        
    except FileNotFoundError:
        print(f"❌ Error: File {csv_file} not found")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python csv-to-json-converter.py input.csv output.json")
        print("Example: python csv-to-json-converter.py products.csv products.json")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    json_file = sys.argv[2]
    
    convert_csv_to_json(csv_file, json_file)
