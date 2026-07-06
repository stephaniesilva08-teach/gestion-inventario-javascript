Proyecto ACME - Sistema de Gestión de Producción e Inventario

Sistema web desarrollado en HTML, CSS y JavaScript, utilizando Firebase Realtime Database como base de datos. La aplicación permite administrar usuarios, controlar el inventario de materias primas y productos terminados, crear recetas de fabricación y ejecutar procesos de producción que actualizan automáticamente el inventario.

Tabla de contenido

-Descripción general

-Tecnologías utilizadas

-Estructura del proyecto

-Flujo de funcionamiento

-Instrucciones de ejecución

-Módulos del sistema

-Web Components

-Base de datos

-Funcionalidades principales

-Posibles mejoras

-Autora

Descripción general


La aplicación administra el flujo de producción de una empresa mediante los siguientes procesos:


-El administrador registra los usuarios que podrán acceder al sistema.

-Los usuarios registrados inician sesión para ingresar a la aplicación.

-Se registran materias primas y productos terminados dentro del inventario.

-Cada producto terminado tiene asociada una receta con las materias primas necesarias para su fabricación.

-Al ejecutar un proceso de producción, el sistema verifica el stock disponible, descuenta automáticamente la materia prima utilizada y aumenta el stock del producto terminado


Tecnologías utilizadas
-HTML5

-CSS3

-JavaScript

-Firebase Realtime Database

-Web Components

-LocalStorage


│
├── index.html                  # Registro de usuarios

├── login.html                  # Inicio de sesión

├── inicio.html                 # Página principal

├── usuarios.html               # Gestión de usuarios

├── inventario.html             # Gestión de inventario

├── registro-producto.html      # Registro de productos

├── receta.html                 # Creación de recetas

├── produccion.html             # Proceso de producción

│

├── css/

│      styles.css

│

├── js/

│      main.js

│      usuarios.js

│      inventario.js

│      receta.js

│      produccion.js

│

└── components/

|       menu.js
       
 |      tabla.js


 index.html
 
Registro de usuarios

        │
        
        ▼
        

Se almacena el usuario en Firebase

        │

        ▼

login.html

Inicio de sesión

        │
        
        ▼

Validación de credenciales

        │
       
        ▼

inicio.html

        │

    ┌──────┼───────────┐

 ▼          ▼           ▼

Usuarios Inventario Producción

              │
              
              ▼
           
          Recetas


Instrucciones de ejecución

-El proyecto no requiere instalación de librerías adicionales.


1. Clonar el repositorio
   
git clone https://github.com/tu-usuario/stock-flow.git

2. Abrir el proyecto


Se recomienda utilizar Visual Studio Code con la extensión Live Server.


3. Ejecutar


Abrir inicialmente el archivo:


index.html

4. Registrar un usuario


La primera pantalla del proyecto corresponde al registro de usuarios.


El usuario deberá ingresar:


Identificación

Nombre

Cargo

Contraseña

Confirmación de contraseña


Al finalizar el registro, la información se almacena en Firebase y el sistema redirecciona automáticamente al Login.


5. Iniciar sesión


En la pantalla login.html el usuario ingresa:


Identificación

Contraseña


Si las credenciales son correctas, el sistema redirecciona a:


inicio.html


Desde allí es posible acceder a todos los módulos del sistema mediante el menú lateral.


Módulos del sistema

Registro de Usuarios (index.html)


Es la primera pantalla del sistema.


Permite:


-Registrar nuevos usuarios.

-Validar que todos los campos estén completos.

-Confirmar la contraseña.

-Guardar usuarios en Firebase.

-Editar usuarios existentes.

-Redireccionar al Login una vez finalizado el registro.


Inicio de Sesión (login.html)


Este módulo controla el acceso al sistema.


Funciones:


-Validar identificación.

-Validar contraseña.

-Consultar Firebase.

-Permitir únicamente el ingreso de usuarios registrados.

-Mostrar mensajes de éxito o error.

-Redireccionar al inicio del sistema.


Inicio (inicio.html)


Es la pantalla principal del sistema.


Desde aquí el usuario puede acceder a:


-Usuarios

-Inventario

-Producción


mediante el menú lateral.


Gestión de Usuarios


Permite administrar los usuarios registrados.


Funciones:


-Registrar usuarios.

-Consultar usuarios.

-Editar información.

-Eliminar usuarios.

-Buscar usuarios.


Inventario


Administra los productos almacenados.


Permite:


-Registrar materias primas.

-Registrar productos terminados.

-Editar productos.

-Eliminar productos.

-Aumentar stock.

-Consultar el inventario.


-Cuando el producto corresponde a un Producto Terminado, el sistema redirecciona automáticamente al módulo de recetas para registrar su fórmula de fabricación.
