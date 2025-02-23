import AWS from 'aws-sdk'

// Configurar DynamoDB
AWS.config.update({
  region: 'us-east-1', // Cambia la región si es necesario
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Crear reserva
const createReservation = async (req, res) => {
  const { movieId, roomId, seats } = req.body;

  // Validación de entradas
  if (!movieId || !roomId || !seats) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios: movieId, roomId, seats' });
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
      seats: seats,         // Número de asientos reservados (podría ser un array si se desea)
      createdAt: new Date().toISOString(), // Timestamp de creación
    },
  };

  // Intentar guardar la reserva en DynamoDB
  try {
    await dynamoDb.put(params).promise();
    // Respuesta exitosa con la reserva creada
    return res.status(201).json({
      id: params.Item.id,
      movieId: params.Item.movieId,
      roomId: params.Item.roomId,
      seats: params.Item.seats,
      createdAt: params.Item.createdAt,
    });
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    return res.status(500).json({ error: 'Error al crear la reserva' });
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
