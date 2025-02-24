import AWS from 'aws-sdk';

// Configurar DynamoDB
AWS.config.update({
  region: 'us-east-1', // Cambia la región si es necesario
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class MovieService {
  // Crear película
  static async createMovie(req, res) {
    const { title, genre, duration, rating } = req.body;
    const id = `${Date.now()}`; // Generar un ID único para la película

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
      await dynamoDb.put(params).promise(); // Insertar la película en DynamoDB
      res.status(201).json(params.Item); // Retornar la película creada
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la película' });
    }
  }

  // Obtener todas las películas
  static async getMovies(req, res) {
    const params = {
      TableName: 'MoviesTable',
    };

    try {
      const result = await dynamoDb.scan(params).promise(); // Obtener todas las películas
      res.status(200).json(result.Items); // Retornar las películas obtenidas
    } catch (error) {
      console.log("Error al obtener las peliculas", error);
      res.status(500).json({ error: 'Error al obtener las películas' });
    }
  }

  // Eliminar una película por título
  static async deleteMovie(req, res) {
    const { title } = req.params; // Obtener el título de la película desde los parámetros de la URL

    if (!title) {
      return res.status(400).json({
        error: "Falta el parámetro obligatorio: title"
      });
    }

    // Buscar la película por título primero para obtener su ID
    const searchParams = {
      TableName: "MoviesTable",
      FilterExpression: "title = :title",
      ExpressionAttributeValues: {
        ":title": title,
      },
    };

    try {
      // Realizar el escaneo para encontrar la película con ese título
      const result = await dynamoDb.scan(searchParams).promise();

      if (result.Items.length === 0) {
        return res.status(404).json({ error: "Película no encontrada con ese título" });
      }

      const movieToDelete = result.Items[0]; // Tomamos la primera coincidencia, asumimos que el título es único

      // Ahora eliminamos la película por el ID
      const deleteParams = {
        TableName: "MoviesTable",
        Key: {
          id: movieToDelete.id,  // Usamos el ID de la película encontrada
        },
      };

      // Eliminar la película
      await dynamoDb.delete(deleteParams).promise();

      // Respuesta exitosa
      return res.status(200).json({
        message: `Película con título "${title}" eliminada correctamente`
      });
    } catch (error) {
      console.error("Error al eliminar la película:", error);
      return res.status(500).json({
        error: "Error al eliminar la película"
      });
    }
  }

  // Actualizar una película por ID
  static async updateMovie(req, res) {
    const { id, title, genre, duration, rating } = req.body;

    if (!id || !title || !genre || !duration || !rating) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: id, title, genre, duration, rating"
      });
    }

    const params = {
      TableName: 'MoviesTable',
      Key: {
        id: id, // ID de la película que queremos actualizar
      },
      UpdateExpression: "set title = :title, genre = :genre, duration = :duration, rating = :rating",
      ExpressionAttributeValues: {
        ":title": title,
        ":genre": genre,
        ":duration": duration,
        ":rating": rating,
      },
      ReturnValues: "UPDATED_NEW", // Para retornar solo los valores actualizados
    };

    try {
      const result = await dynamoDb.update(params).promise();

      res.status(200).json({
        message: "Película actualizada correctamente",
        updatedMovie: result.Attributes, // Los valores actualizados
      });
    } catch (error) {
      console.error("Error al actualizar la película:", error);
      res.status(500).json({
        error: "Error al actualizar la película"
      });
    }
  }
}

module.exports = MovieService;
