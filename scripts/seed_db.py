#!/usr/bin/env python3
import json
import sys
from pymongo import MongoClient

def fix_and_load_json(json_file_path, mongo_uri='mongodb://localhost:27017/', db_name='news-portal'):
    """Fix JSON encoding issues and load into MongoDB"""
    
    # Check if mongo_uri is provided via environment variable
    import os
    mongo_uri = os.getenv('MONGODB_URI', mongo_uri)
    
    # Extract database name from URI if present
    if '/news-portal' in mongo_uri or '/' in mongo_uri.split('?')[0].split('@')[-1]:
        # Database name is in the URI
        pass
    else:
        # Append database name
        if '?' in mongo_uri:
            mongo_uri = mongo_uri.replace('?', f'/{db_name}?')
        else:
            mongo_uri = f'{mongo_uri}/{db_name}'
    
    print(f"Reading {json_file_path}...")
    
    try:
        # Try reading with different encodings and error handling
        with open(json_file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Try to parse
        print("Parsing JSON...")
        try:
            posts = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"JSON decode error at position {e.pos}: {e.msg}")
            print("Attempting to fix...")
            
            # Replace problematic characters
            content = content.replace('\\x', ' ')
            content = content.encode('utf-8', 'ignore').decode('utf-8')
            
            try:
                posts = json.loads(content)
            except:
                # Last resort: use eval with literal_eval
                import ast
                posts = ast.literal_eval(content)
        
        print(f"Successfully parsed {len(posts)} posts")
        
        # Connect to MongoDB
        print(f"Connecting to MongoDB...")
        client = MongoClient(mongo_uri)
        
        # Extract database name from URI or use default
        if '/news-portal' in mongo_uri:
            db = client.get_database()  # Use database from URI
        else:
            db = client[db_name]
        
        collection = db['blogposts']
        
        # Clear existing data
        print("Clearing existing data...")
        collection.delete_many({})
        
        # Filter and clean posts
        valid_posts = []
        for i, post in enumerate(posts):
            if post.get('title') and post.get('basename') and post.get('category'):
                # Ensure all required fields exist
                cleaned_post = {
                    'author': post.get('author', 'Unknown'),
                    'author_email': post.get('author_email', ''),
                    'title': post.get('title', ''),
                    'status': post.get('status', 'Publish'),
                    'allow_comments': post.get('allow_comments', 1),
                    'convert_breaks': post.get('convert_breaks', 'wysiwyg'),
                    'allow_pings': post.get('allow_pings', 0),
                    'basename': post.get('basename', ''),
                    'category': post.get('category', ''),
                    'unique_url': post.get('unique_url', ''),
                    'date': post.get('date', ''),
                    'body': post.get('body', ''),
                    'extended_body': post.get('extended_body', ''),
                    'excerpt': post.get('excerpt', ''),
                    'keywords': post.get('keywords', ''),
                    'date_parsed': post.get('date_parsed', post.get('date', '')),
                }
                valid_posts.append(cleaned_post)
        
        print(f"Valid posts: {len(valid_posts)}")
        
        # Insert in batches
        batch_size = 100
        total_inserted = 0
        for i in range(0, len(valid_posts), batch_size):
            batch = valid_posts[i:i + batch_size]
            try:
                result = collection.insert_many(batch, ordered=False)
                total_inserted += len(result.inserted_ids)
            except Exception as e:
                # Count successful inserts even with duplicates
                if hasattr(e, 'details') and 'nInserted' in e.details:
                    total_inserted += e.details['nInserted']
                # Continue with next batch
            print(f"Processed {min(i + batch_size, len(valid_posts))} / {len(valid_posts)} posts (inserted: {total_inserted})")
        
        print(f"\n✅ Successfully loaded {total_inserted} unique posts into MongoDB!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    json_file = sys.argv[1] if len(sys.argv) > 1 else '../blog_posts3.json'
    success = fix_and_load_json(json_file)
    sys.exit(0 if success else 1)
