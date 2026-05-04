from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

ADMIN_PASSWORD = "nepalee@123"
DATA_FILE = "data/blogs.json"
UPLOAD_FOLDER = "assets/uploads"

# Ensure directories exist
os.makedirs("data", exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    password = data.get("password")
    if password == ADMIN_PASSWORD:
        return jsonify({"success": True, "message": "Authenticated successfully"}), 200
    else:
        return jsonify({"success": False, "message": "Access Denied"}), 401

@app.route("/upload-blog", methods=["POST"])
def upload_blog():
    data = request.json
    title = data.get("title")
    content = data.get("content")
    date = datetime.now().strftime("%b %d, %Y")
    
    if not title or not content:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    with open(DATA_FILE, "r") as f:
        blogs = json.load(f)
    
    new_blog = {
        "id": len(blogs) + 1,
        "title": title,
        "content": content,
        "date": date
    }
    blogs.append(new_blog)
    
    with open(DATA_FILE, "w") as f:
        json.dump(blogs, f, indent=4)
    
    return jsonify({"success": True, "message": "Blog uploaded successfully"}), 200

@app.route("/upload-photo", methods=["POST"])
def upload_photo():
    data = request.json
    image_data = data.get("image") # Base64 string
    caption = data.get("caption")
    
    if not image_data:
        return jsonify({"success": False, "message": "No image data"}), 400
    
    try:
        # Assuming format: data:image/png;base64,xxxx
        header, encoded = image_data.split(",", 1)
        ext = header.split("/")[1].split(";")[0]
        filename = f"photo_{int(datetime.now().timestamp())}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(encoded))
            
        # Update a gallery JSON or just return success
        # For simplicity, we can keep a gallery.json too
        GALLERY_FILE = "data/gallery.json"
        if not os.path.exists(GALLERY_FILE):
            with open(GALLERY_FILE, "w") as f:
                json.dump([], f)
                
        with open(GALLERY_FILE, "r") as f:
            gallery = json.load(f)
            
        gallery.append({"url": f"assets/uploads/{filename}", "caption": caption})
        
        with open(GALLERY_FILE, "w") as f:
            json.dump(gallery, f, indent=4)
            
        return jsonify({"success": True, "message": "Photo uploaded successfully", "url": f"assets/uploads/{filename}"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/get-stats", methods=["GET"])
def get_stats():
    try:
        with open(DATA_FILE, "r") as f:
            blogs = json.load(f)
        
        GALLERY_FILE = "data/gallery.json"
        if os.path.exists(GALLERY_FILE):
            with open(GALLERY_FILE, "r") as f:
                gallery = json.load(f)
        else:
            gallery = []
            
        return jsonify({
            "blog_count": len(blogs),
            "gallery_count": len(gallery)
        }), 200
    except Exception as e:
        return jsonify({"blog_count": 0, "gallery_count": 0}), 200

@app.route("/get-blogs", methods=["GET"])
def get_blogs():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                blogs = json.load(f)
            return jsonify(blogs), 200
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-gallery", methods=["GET"])
def get_gallery():
    try:
        GALLERY_FILE = "data/gallery.json"
        if os.path.exists(GALLERY_FILE):
            with open(GALLERY_FILE, "r") as f:
                gallery = json.load(f)
            return jsonify(gallery), 200
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
