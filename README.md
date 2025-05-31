# 🧠 Habit Tracker App

Este proyecto consiste en una aplicación full stack para el registro y seguimiento de hábitos saludables.  
La arquitectura está dividida en dos partes:

- **Backend**: desarrollado en Python con Flask, expone una API RESTful para el manejo de usuarios, hábitos y su seguimiento.
- **Frontend**: desarrollado con HTML, CSS y JavaScript puro, encargado de la interfaz visual y la interacción con la API.

---

## 🚀 Tecnologías

- **Backend**: Python + Flask  
- **Frontend**: HTML + CSS + JavaScript puro

---

## 📁 Estructura del repositorio

```
Arquitectura organizada por áreas funcionales (users, habits, etc.)

/backend
    ├── app.py
    ├── src/
    │   ├── database/               # Archivo JSON donde se guardan los datos
    │   ├── routes/ 
    │   │   └── habits_routes.py    # Rutas relacionadas con los hábitos y su trackeo
    │   │   └── users_routes.py     # Rutas relacionadas con los usuarios del sistema
    │   ├── services/               # Vincula las lógicas de cada ruta con el db_service
    │   │   └── db_service.py       # Con todos los métodos relacionados a la persistencia de datos
    │   │   └── habits_service.py   # Lógica de negocio aplicada a los hábitos
    |   │       └── habits_service.py   # Lógica de negocio aplicada a los hábitos
    │   │       └── users_service.py    # Lógica de negocio aplicada a los usuarios
    ├── utils/                 # Funciones auxiliares
/frontend
    ├── index.html             # Página de login
    ├── assets/
    │   ├── css/               # Archivos de estilos
    │   ├── js/                # Scripts generales
    │   ├── config/
    │   │   └── env.js         # Variables de entorno para configuración
    │   ├── img/               # Favicon e imágenes
    │   └── pages/
    │       ├── users/
    │       │   ├── auth/      # login.js, register.js and logout.js
    │       │   └── profile.js
    │       ├── habits/
    │       │   ├── habits.js
    │       │   ├── reports.js
    │       │   └── tracking.js
```

---

## 🔑 Funcionalidades principales

- Registro y login de usuarios
- Persistencia de datos mediante archivos JSON
- CRUD de hábitos (crear, ver, editar, eliminar)
- Visualización de reportes y seguimiento diario (CRUD trackeo de hábitos)
- Logout y gestión de sesión

---

## 📦 Configuración de entorno

La configuración del entorno en el frontend se realiza a través del archivo `env.js` para poder ser accedidas desde los diferentes archivos javascript que componen el proyecto:

```js
window.env = {
  BACKEND_URL: "http://localhost:5000/api",
  VERSION: "1.0.0",
};
```

---

## 🔐 Autenticación

- El sistema cuenta con **registro** y **login** de usuarios.
- El estado de sesión se gestiona en el frontend con JavaScript.

---

## 🛠️ Cómo ejecutar el proyecto

### 1. Cloná el repositorio

```bash
git clone https://github.com/Denise-E/Habits_Management
cd Habits_Management
```

### 2. Configuración del Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

La API se levantará en el puerto `http://localhost:5000`.

### 3. Abrir el frontend

Desde la carpeta raíz del proyecto, podés abrir el archivo `index.html` directamente en tu navegador. Para esto, hacé click derecho en el archivo, apretá la opción "copy path" del menú y pegá la ruta directamente en el navegador para comenzar a interactuar con la página web.

> No se requiere compilación ni bundlers.


## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para la materia Arquitectura Web de la Universidad de Palermo.
