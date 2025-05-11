# 🧠 Habit Tracker App

Este proyecto consiste en una aplicación full stack para el registro y seguimiento de hábitos saludables.  
La arquitectura está dividida en dos partes:

- **Backend**: desarrollado en Python con Flask, expone una API RESTful para el manejo de usuarios, hábitos y su seguimiento.
- **Frontend**: desarrollado en React, encargado de la interfaz visual (aún en desarrollo).

---

## 🚀 Tecnologías

- **Backend**: Python + Flask  
- **Frontend**: React + Vite (u otra herramienta moderna de React)

---

## 📁 Estructura del repositorio

```
/backend
    ├── app.py
    ├── routes/
    ├── database/
    └── ...
/frontend
    └── (a desarrollar)
```

---

## 🛠️ Cómo ejecutar el proyecto

### 1. Cloná el repositorio

```bash
git clone https://github.com/tu-usuario/nombre-del-repo.git
cd nombre-del-repo
```

### 2. Configuración del Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

La API se levantará en `http://localhost:5000`.

> Si no tenés un archivo `requirements.txt`, podés generarlo con:  
> `pip freeze > requirements.txt`

### 3. (Opcional) Iniciar el Frontend

Cuando esté desarrollado, se podrá iniciar con:

```bash
cd frontend
npm install
npm run dev
```
