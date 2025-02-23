import AWS from 'aws-sdk'
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' }); // Usamos la región en la que SES está habilitado

// Crear una nueva reserva
const createReservation = async (req, res) => {
  const { movieId, roomId, seats, email } = req.body;

  // Validación de entradas
  if (!movieId || !roomId || !seats || !email) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios: movieId, roomId, seats, email' });
  }

  // Generar un ID único para la reserva
  const id = `${Date.now()}`;

  // Configuración de parámetros para DynamoDB
  const params = {
    TableName: 'ReservationsTable',
    Item: {
      id: id,               // Clave hash (única para cada reserva)
      movieId: movieId,     // Clave de ordenación (para ordenar por película)
      roomId: roomId,       // Identificador de la sala
      seats: seats,         // Número de asientos reservados
      email: email,         // Correo electrónico del usuario
      createdAt: new Date().toISOString(), // Timestamp de creación
    },
  };

  // Intentar guardar la reserva en DynamoDB
  try {
    await dynamoDb.put(params).promise();

    // Enviar correo de confirmación de reserva
    const emailParams = {
      Source: 'juansaavedra2406@gmail.com', // Reemplaza con tu dirección de correo verificada en SES
      Destination: {
        ToAddresses: [email], // Dirección de correo electrónico proporcionada
      },
      Message: {
        Subject: {
          Data: 'Confirmación de reserva',
        },
        Body: {
          Text: {
            Data: `¡Hola!\n\nTu reserva para la película con ID ${movieId} en la sala ${roomId} ha sido confirmada.\n\nNúmero de asientos reservados: ${seats}\n\nGracias por elegirnos.`,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise(); // Enviar el correo electrónico

    // Respuesta exitosa con la reserva creada
    return res.status(201).json({
      id: params.Item.id,
      movieId: params.Item.movieId,
      roomId: params.Item.roomId,
      seats: params.Item.seats,
      email: params.Item.email,
      createdAt: params.Item.createdAt,
    });
  } catch (error) {
    console.error('Error al crear la reserva o enviar el correo:', error);
    return res.status(500).json({ error: 'Error al crear la reserva o enviar el correo' });
  }
};

// Obtener todas las reservas
const getReservations = async (req, res) => {
  const params = {
    TableName: 'ReservationsTable',
  };

  try {
    const result = await dynamoDb.scan(params).promise();  // Obtener todas las reservas
    res.status(200).json(result.Items);  // Retornar las reservas obtenidas
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

module.exports = { createReservation, getReservations };
