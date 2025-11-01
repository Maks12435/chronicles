import os
import sys
import subprocess
import time

def print_colored(text, color):
    colors = {'green': '\033[92m', 'yellow': '\033[93m', 'red': '\033[91m', 'blue': '\033[94m', 'reset': '\033[0m'}
    print(f"{colors.get(color, '')}{text}{colors['reset']}")

def check_python():
    import sys
    if sys.version_info < (3, 8):
        print_colored("❌ Python 3.8+ required", "red")
        return False
    print_colored("✅ Python OK", "green")
    return True

def install_backend_deps():
    try:
        print_colored("📦 Installing backend deps...", "blue")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print_colored("✅ Backend deps installed", "green")
        return True
    except subprocess.CalledProcessError as e:
        print_colored(f"❌ Backend deps error: {e}", "red")
        return False

def install_frontend_deps():
    try:
        print_colored("📦 Installing frontend deps...", "blue")
        if os.path.exists("react/yarn.lock"):
            subprocess.check_call(["yarn", "install"], cwd="react")
        else:
            subprocess.check_call(["npm", "install"], cwd="react")
        print_colored("✅ Frontend deps installed", "green")
        return True
    except subprocess.CalledProcessError as e:
        print_colored(f"❌ Frontend deps error: {e}", "red")
        return False

def init_demo_db():
    try:
        print_colored("🗃️ Creating demo DB...", "blue")
        sys.path.append("backend")
        from backend.demo_data import init_demo_database
        init_demo_database()
        print_colored("✅ Demo DB created", "green")
        return True
    except Exception as e:
        print_colored(f"❌ Demo DB error: {e}", "red")
        return False

def start_backend():
    try:
        print_colored("🚀 Starting backend...", "blue")
        backend_process = subprocess.Popen(
            [sys.executable, "backend/demo_main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        time.sleep(3)
        if backend_process.poll() is None:
            print_colored("✅ Backend: http://localhost:8080", "green")
            return backend_process
        else:
            stdout, stderr = backend_process.communicate()
            print_colored(f"❌ Backend error: {stderr}", "red")
            return None
    except Exception as e:
        print_colored(f"❌ Backend error: {e}", "red")
        return None

def start_frontend():
    try:
        print_colored("🚀 Starting frontend...", "blue")
        if os.path.exists("react/yarn.lock"):
            frontend_process = subprocess.Popen(["yarn", "dev"], cwd="react", stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        else:
            frontend_process = subprocess.Popen(["npm", "run", "dev"], cwd="react", stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        time.sleep(5)
        if frontend_process.poll() is None:
            print_colored("✅ Frontend: http://localhost:5173", "green")
            return frontend_process
        else:
            stdout, stderr = frontend_process.communicate()
            print_colored(f"❌ Frontend error: {stderr}", "red")
            return None
    except Exception as e:
        print_colored(f"❌ Frontend error: {e}", "red")
        return None

def main():
    print_colored("🎬 Starting Chronicles Demo", "yellow")
    print_colored("=" * 40, "yellow")
    
    if not (os.path.exists("backend") and os.path.exists("react")):
        print_colored("❌ Run from project root", "red")
        return
    
    if not check_python():
        return
    
    if not install_backend_deps():
        return
    
    if not install_frontend_deps():
        return
    
    if not init_demo_db():
        return
    
    backend_process = start_backend()
    if not backend_process:
        return
    
    frontend_process = start_frontend()
    if not frontend_process:
        backend_process.terminate()
        return
    
    print_colored("\n🎉 Chronicles Demo Started!", "green")
    print_colored("=" * 40, "green")
    print_colored("🌐 Frontend: http://localhost:5173", "blue")
    print_colored("🔧 Backend: http://localhost:8080", "blue")
    print_colored("🔑 Demo: demo@chronicles.com / demo123", "yellow")
    print_colored("\n⏹️  Press Ctrl+C to stop", "red")
    
    try:
        while backend_process.poll() is None and frontend_process.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        print_colored("\n🛑 Stopping...", "red")
        backend_process.terminate()
        frontend_process.terminate()
        print_colored("✅ Stopped", "green")

if __name__ == "__main__":
    main()
