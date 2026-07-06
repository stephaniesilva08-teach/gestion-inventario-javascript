Proyecto ACME - Sistema de Gestión de Producción e Inventario

Sistema web desarrollado en HTML, CSS y JavaScript, utilizando Firebase Realtime Database como base de datos. La aplicación permite administrar usuarios, controlar el inventario de materias primas y productos terminados, crear recetas de fabricación y ejecutar procesos de producción que actualizan automáticamente el inventario.

Tabla de contenido

- Descripción general

- Tecnologías utilizadas

- Estructura del proyecto

- Instrucciones de ejecución

- Módulos del sistema

- Web Components

- Base de datos

- Funcionalidades principales

- Posibles mejoras

- Autora

Descripción general


La aplicación administra el flujo de producción de una empresa mediante los siguientes procesos:


- El administrador registra los usuarios que podrán acceder al sistema.

- Los usuarios registrados inician sesión para ingresar a la aplicación.

- Se registran materias primas y productos terminados dentro del inventario.

- Cada producto terminado tiene asociada una receta con las materias primas necesarias para su fabricación.

- Al ejecutar un proceso de producción, el sistema verifica el stock disponible, descuenta automáticamente la materia prima utilizada y aumenta el stock del producto terminado


Tecnologías utilizadas

- HTML5

- CSS3

- JavaScript

- Firebase Realtime Database

- Web Components

- LocalStorage



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



Instrucciones de ejecución

- El proyecto no requiere instalación de librerías adicionales.


1. Clonar el repositorio
   
git clone https://github.com/stephaniesilva08-teach/gestion-inventario-javascript.git

2. Abrir el proyecto


- Se recomienda utilizar Visual Studio Code con la extensión Live Server.


3. Ejecutar


Abrir inicialmente el archivo:


- index.html

4. Registrar un usuario


- La primera pantalla del proyecto corresponde al registro de usuarios.


El usuario deberá ingresar:


- Identificación

- Nombre

- Cargo

- Contraseña

- Confirmación de contraseña


- Al finalizar el registro, la información se almacena en Firebase y el sistema redirecciona automáticamente al Login.


5. Iniciar sesión


En la pantalla login.html el usuario ingresa:


- Identificación

- Contraseña


Si las credenciales son correctas, el sistema redirecciona a:


- inicio.html


Desde allí es posible acceder a todos los módulos del sistema mediante el menú lateral.


- Módulos del sistema

REGISTRO DE USUARIOS (index.html)


Es la primera pantalla del sistema.


Permite:


- Registrar nuevos usuarios.

- Validar que todos los campos estén completos.

- Confirmar la contraseña.

- Guardar usuarios en Firebase.

- Editar usuarios existentes.

- Redireccionar al Login una vez finalizado el registro.


INICIO DE SESION (login.html)


Este módulo controla el acceso al sistema.


Funciones:


- Validar identificación.

- Validar contraseña.

- Consultar Firebase.

- Permitir únicamente el ingreso de usuarios registrados.

- Mostrar mensajes de éxito o error.

- Redireccionar al inicio del sistema.


INICIO (inicio.html)


Es la pantalla principal del sistema.


Desde aquí el usuario puede acceder a:


- Usuarios

- Inventario

- Producción


- mediante el menú lateral.


GESTION DE USUARIOS


Permite administrar los usuarios registrados.


Funciones:


- Registrar usuarios.

- Consultar usuarios.

- Editar información.

- Eliminar usuarios.

- Buscar usuarios.


INVENTARIO


Administra los productos almacenados.


Permite:


- Registrar materias primas.

- Registrar productos terminados.

- Editar productos.

- Eliminar productos.

- Aumentar stock.

- Consultar el inventario.


- Cuando el producto corresponde a un Producto Terminado, el sistema redirecciona automáticamente al módulo de recetas para registrar su fórmula de fabricación.


RECETAS


Permite asociar una receta a un producto terminado.


Cada receta está compuesta por:


- Materias primas.

- Cantidad necesaria de cada materia prima.


- La receta queda almacenada junto con el producto dentro de Firebase.


PRODUCCION


Este módulo ejecuta el proceso de fabricación.


El sistema:



- Muestra únicamente los productos terminados.


- Solicita la cantidad a fabricar.

- Consulta la receta.

- Verifica el stock disponible.

- Descuenta automáticamente la materia prima utilizada.

- Incrementa el stock del producto terminado.

- Registra el proceso realizado en Firebase.

-Muestra un resumen de la producción.


Web Components


- Menú lateral (menu.js)


Componente personalizado:


<menu-lateral></menu-lateral>


Función


- Se encarga de mostrar el menú de navegación en todas las páginas internas del sistema.


Incluye los accesos a:


- Inicio

- Usuarios

- Inventario

- Producción


Ventajas

- Evita repetir el mismo código HTML en todas las páginas.

- Facilita el mantenimiento del menú.

- Si se modifica una opción del menú, el cambio se refleja automáticamente en todas las vistas.


- Tabla dinámica (tabla.js)

Componente personalizado:

<tabla-usuarios></tabla-usuarios>


Función


Es un componente reutilizable que genera automáticamente las tablas utilizadas en los módulos del sistema.


Dependiendo de la configuración recibida, puede mostrar:


- Usuarios

- Productos del inventario


La tabla se construye dinámicamente utilizando los datos obtenidos desde Firebase.


Funcionalidades

- Mostrar registros dinámicamente.

- Crear las columnas según la configuración recibida.

- Buscar registros mediante un filtro.

- Editar registros.

-Eliminar registros.

- Incrementar el stock de productos cuando corresponde.

- Mostrar mensajes cuando no existen datos.

- Eventos personalizados utilizados


El componente emite eventos para comunicarse con los demás módulos del sistema:


-editar-item

- eliminar-item

- aumentar-stock

- Cada módulo escucha estos eventos y ejecuta la acción correspondiente.

AUTOR
Stephanie Nathalia Silva Baron - curso JavaScript
