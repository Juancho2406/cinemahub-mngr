import AWS from 'aws-sdk'

// Configurar DynamoDB
AWS.config.update({
  region: 'us-east-1', // Cambia la región si es necesario
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Crear sala
const createRoom = async (req, res) => {
  const { name, capacity } = req.body;
  const id = `${Date.now()}`;  // Generar un ID único para la sala

  const params = {
    TableName: 'RoomsTable',
    Item: {
      id: id,
      name: name,
      capacity: capacity,
    },
  };

  try {
    await dynamoDb.put(params).promise();  // Insertar la sala en DynamoDB
    res.status(201).json(params.Item);  // Retornar la sala creada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la sala' });
  }
};

// Obtener todas las salas
const getRooms = async (req, res) => {
  const params = {
    TableName: 'RoomsTable',
  };

  try {
    const result = await dynamoDb.scan(params).promise();  // Obtener todas las salas
    res.status(200).json(result.Items);  // Retornar las salas obtenidas
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las salas' });
  }
};

module.exports = { createRoom, getRooms };
