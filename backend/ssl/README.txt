🔒 SSL Certificates Directory
==============================

This folder contains SSL certificates for local HTTPS development.

⚠️ CERTIFICATES ARE NOT IN THE REPOSITORY!

📋 How to generate certificates:
---------------------------------

1. Install mkcert:
   choco install mkcert

2. Initialize mkcert CA:
   mkcert -install

3. Generate certificates for localhost:
   cd backend
   mkcert -key-file ssl\key.pem -cert-file ssl\cert.pem localhost 127.0.0.1 ::1

4. Restart Docker containers:
   cd ..
   docker compose down
   docker compose up -d

✅ DONE! HTTPS will be available at: https://localhost:8443

📁 Files that should be in this folder:
---------------------------------------
- cert.pem   (SSL certificate - DO NOT commit!)
- key.pem    (private key - DO NOT commit!)
- README.txt (this instruction file)

🔗 More info:
-------------
https://github.com/FiloSottile/mkcert
