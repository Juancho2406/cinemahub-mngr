Sistema de Gestión de Reservas para un Cine 🎥
Este proyecto implementa un sistema de gestión de reservas para un cine utilizando Node.js (Express) para el backend y React para el frontend. La base de datos en la nube utilizada es AWS DynamoDB , y se ha integrado AWS SES para enviar notificaciones por correo electrónico cuando se realiza una reserva exitosa.

Tabla de Contenidos

- Registrar películas con detalles como título, género, duración y clasificación.
- Gestionar salas con nombre y capacidad.
- Reservar asientos seleccionando una película, sala, horario y asientos específicos.
- Listar todas las películas, salas y reservas realizadas.
- Enviar notificaciones por correo electrónico al usuario cuando se realiza una reserva exitosa (Si tiene un correo electronico verificado con la cuenta aws).
- Este proyecto utiliza tecnologías modernas como Node.js (Express) para el backend, React para el frontend y AWS DynamoDB como base de datos en la nube 


Como correr el proyecto? 

Utilice los scripts del package.json

npm run dev //modo desarrollo
npm run build && npm run start:prod // para ambiente productivo

El proyecto tiene un pipeline de despliegue que se encarga de desplegar directamente en una lambda 

