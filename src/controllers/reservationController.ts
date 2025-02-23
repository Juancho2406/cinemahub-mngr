import AWS from 'aws-sdk'

// Configurar DynamoDB
AWS.config.update({
  region: 'us-east-1', // Cambia la región si es necesario
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Crear reserva
const createReservation = async (req, res) => {
  const { movie, room, seats } = req.body;
  const id = `${Date.now()}`;  // Generar un ID único para la reserva

  const params = {
    TableName: 'ReservationsTable',
    Item: {
      id: id,
      movie: movie,
      room: room,
      seats: seats,
    },
  };

  try {
    await dynamoDb.put(params).promise();  // Insertar la reserva en DynamoDB
    res.status(201).json(params.Item);  // Retornar la reserva creada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
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
