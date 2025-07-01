import docx
import os

def read_file(filename, content_bytes):
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".txt":
        return content_bytes.decode("utf-8").strip()

    elif ext == ".docx":
        from io import BytesIO
        doc = docx.Document(BytesIO(content_bytes))
        return "\n".join([para.text.strip() for para in doc.paragraphs if para.text.strip()])

    else:
        raise ValueError("Unsupported file format. Only .txt and .docx are allowed.")
