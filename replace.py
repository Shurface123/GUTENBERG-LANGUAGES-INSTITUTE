import glob, re

files = glob.glob('*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = re.sub(r'<a\s+href="#">Privacy Policy</a>\s*\|\s*<a\s*href="#">Terms of Service</a>', '<a href="privacy-policy.html">Privacy Policy</a> | <a href="terms.html">Terms of Service</a>', content)
    content = re.sub(r'<a\s+href="#">Privacy Policy</a>\s*\|\s*<a\n\s*href="#">Terms of Service</a>', '<a href="privacy-policy.html">Privacy Policy</a> | <a\n                        href="terms.html">Terms of Service</a>', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
