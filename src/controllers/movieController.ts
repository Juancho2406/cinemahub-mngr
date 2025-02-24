import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1"
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class MovieService {
  static async createMovie(req, res) {
    const { title, genre, duration, rating } = req.body;
    const id = `${Date.now()}`;

    const params = {
      TableName: "MoviesTable",
      Item: {
        id: id,
        title: title,
        genre: genre,
        duration: duration,
        rating: rating
      }
    };

    try {
      await dynamoDb.put(params).promise();
      res.status(201).json(params.Item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la película" });
    }
  }

  static async getMovies(req, res) {
    const params = {
      TableName: "MoviesTable"
    };

    try {
      const result = await dynamoDb.scan(params).promise();
      res.status(200).json(result.Items);
    } catch (error) {
      console.log("Error al obtener las peliculas", error);
      res.status(500).json({ error: "Error al obtener las películas" });
    }
  }

  static async deleteMovie(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Falta el parámetro obligatorio: id"
      });
    }
    try {
      const deleteParams = {
        TableName: "MoviesTable",
        Key: {
          id: id
        }
      };
      await dynamoDb.delete(deleteParams).promise();
      return res.status(200).json({
        message: `Película con id "${id}" eliminada correctamente`
      });
    } catch (error) {
      console.error("Error al eliminar la película:", error);
      return res.status(500).json({
        error: "Error al eliminar la película"
      });
    }
  }
  static async updateMovie(req, res) {
    const { id, title, genre, duration, rating } = req.body;

    if (!id || !title || !genre || !duration || !rating) {
      return res.status(400).json({
        error:
          "Faltan parámetros obligatorios: id, title, genre, duration, rating"
      });
    }

    const params = {
      TableName: "MoviesTable",
      Key: {
        id: id
      },
      UpdateExpression:
        "set title = :title, genre = :genre, duration = :duration, rating = :rating",
      ExpressionAttributeValues: {
        ":title": title,
        ":genre": genre,
        ":duration": duration,
        ":rating": rating
      },
      ReturnValues: "UPDATED_NEW"
    };

    try {
      const result = await dynamoDb.update(params).promise();

      res.status(200).json({
        message: "Película actualizada correctamente",
        updatedMovie: result.Attributes
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
