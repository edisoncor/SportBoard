import subprocess
import sys
from app import create_app

# Ejecutar el comando para instalar las dependencias desde requirements.txt
subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Crear la app
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
