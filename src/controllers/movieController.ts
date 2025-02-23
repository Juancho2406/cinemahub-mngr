const AWS = require('aws-sdk');

// Configurar DynamoDB
AWS.config.update({
  region: 'us-east-1', // Cambia la región si es necesario
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Crear película
const createMovie = async (req, res) => {
  const { title, genre, duration, rating } = req.body;
  const id = `${Date.now()}`;  // Generar un ID único para la película

  const params = {
    TableName: 'MoviesTable',
    Item: {
      id: id,
      title: title,
      genre: genre,
      duration: duration,
      rating: rating,
    },
  };

  try {
    await dynamoDb.put(params).promise();  // Insertar la película en DynamoDB
    res.status(201).json(params.Item);  // Retornar la película creada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la película' });
  }
};

// Obtener todas las películas
const getMovies = async (req, res) => {
  const params = {
    TableName: 'MoviesTable',
  };

  try {
    const result = await dynamoDb.scan(params).promise();  // Obtener todas las películas
    res.status(200).json(result.Items);  // Retornar las películas obtenidas
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
};

module.exports = { createMovie, getMovies };


module.exports = { createMovie, getMovies };
