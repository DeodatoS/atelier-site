#!/usr/bin/env python3
"""
Pages Content CSV to JSON Converter
Converts static page content from CSV format to JSON for dynamic loading
"""

import csv
import json
from collections import defaultdict

def csv_to_json():
    """Convert pages content CSV to JSON format"""
    
    # Read CSV file
    pages_data = defaultdict(lambda: defaultdict(list))
    
    try:
        with open('pages-content-template.csv', 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                page_id = row['page_id']
                content_type = row['content_type']
                
                # Convert string boolean to actual boolean
                is_active = row['is_active'].lower() == 'true' if row['is_active'] else True
                
                # Safe conversion of order_position
                try:
                    order_position = int(row['order_position']) if row['order_position'] and row['order_position'].isdigit() else 0
                except (ValueError, AttributeError):
                    order_position = 0
                
                content_item = {
                    'section_id': row['section_id'],
                    'content_type': content_type,
                    'title': row['title'],
                    'subtitle': row['subtitle'],
                    'description': row['description'],
                    'image_url': row['image_url'],
                    'image_alt': row['image_alt'],
                    'order_position': order_position,
                    'is_active': is_active
                }
                
                # Remove empty fields to keep JSON clean
                content_item = {k: v for k, v in content_item.items() if v != ''}
                
                # Group by content type within each page
                pages_data[page_id][content_type].append(content_item)
    
    except FileNotFoundError:
        print("❌ Error: pages-content-template.csv not found!")
        return
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return
    
    # Sort content by order_position within each content type
    for page_id in pages_data:
        for content_type in pages_data[page_id]:
            pages_data[page_id][content_type].sort(key=lambda x: int(x.get('order_position', 0)) if str(x.get('order_position', 0)).isdigit() else 0)
    
    # Convert defaultdict to regular dict for JSON serialization
    final_data = {}
    for page_id, page_content in pages_data.items():
        final_data[page_id] = dict(page_content)
    
    # Write JSON file
    try:
        with open('pages-content.json', 'w', encoding='utf-8') as jsonfile:
            json.dump(final_data, jsonfile, indent=2, ensure_ascii=False)
        
        print("✅ Successfully converted pages-content-template.csv to pages-content.json")
        print(f"📊 Generated content for {len(final_data)} pages")
        
        # Print summary
        for page_id, content_types in final_data.items():
            content_count = sum(len(items) for items in content_types.values())
            print(f"   📄 {page_id}: {content_count} content items")
    
    except Exception as e:
        print(f"❌ Error writing JSON: {e}")

def validate_content():
    """Validate the generated JSON content"""
    try:
        with open('pages-content.json', 'r', encoding='utf-8') as jsonfile:
            data = json.load(jsonfile)
        
        print("\n🔍 Content Validation:")
        print(f"✅ Valid JSON structure")
        print(f"📄 Total pages: {len(data)}")
        
        for page_id, content_types in data.items():
            total_content = sum(len(items) for items in content_types.values())
            print(f"   {page_id}: {len(content_types)} content types, {total_content} items")
        
        return True
    
    except Exception as e:
        print(f"❌ JSON validation failed: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Converting Pages Content CSV to JSON...")
    csv_to_json()
    validate_content()
