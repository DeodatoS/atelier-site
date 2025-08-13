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
            'name': 'Privé & Ceremonial',
            'description': 'Exquisite pieces for special occasions and refined experiences'
        },
        'collections': {
            'name': 'Collections', 
            'description': 'Curated seasonal collections showcasing contemporary Italian elegance'
        },
        'kids': {
            'name': 'Kids',
            'description': 'Charming and comfortable pieces designed especially for children'
        }
    }
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # Convert prices to integers
                prices = {
                    'standard': int(row['prices_standard']),
                    'minimum': int(row['prices_minimum']),
                    'maximum': int(row['prices_maximum'])
                }
                
                # Convert comma-separated lists
                colors = [color.strip() for color in row['colors'].split(',')]
                sizes = [size.strip() for size in row['sizes'].split(',')]
                
                # Create product object
                product = {
                    'id': row['id'],
                    'name': row['name'],
                    'category': row['category'],
                    'description': row['description'],
                    'image': row['image'],
                    'gallery': [row['image']],  # Single image for now
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
