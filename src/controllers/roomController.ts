import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class RoomService {
  // Crear sala
  static async createRoom(req, res) {
    const { name, capacity, seats, reservedSeats } = req.body;
    const id = `${Date.now()}`; // Generar un ID único para la sala

    const params = {
      TableName: "RoomsTable",
      Item: {
        id: id,
        name,
        capacity,
        seats,
        reservedSeats
      }
    };

    try {
      await dynamoDb.put(params).promise(); // Insertar la sala en DynamoDB
      res.status(201).json(params.Item); // Retornar la sala creada
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la sala" });
    }
  }

  // Obtener todas las salas
  static async getRooms(req, res) {
    const params = {
      TableName: "RoomsTable"
    };

    try {
      const result = await dynamoDb.scan(params).promise(); // Obtener todas las salas
      res.status(200).json(result.Items); // Retornar las salas obtenidas
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener las salas" });
    }
  }

  // Eliminar una sala por nombre
  static async deleteRoom(req, res) {
    const { id } = req.params; // Obtener el nombre de la sala desde los parámetros de la URL

    if (!id) {
      return res.status(400).json({
        error: "Falta el parámetro obligatorio: id"
      });
    }

    try {
     
      // Ahora eliminamos la sala por el ID
      const deleteParams = {
        TableName: "RoomsTable",
        Key: {
          id: id // Usamos el ID de la sala encontrada
        }
      };

      // Eliminar la sala
      await dynamoDb.delete(deleteParams).promise();

      // Respuesta exitosa
      return res.status(200).json({
        message: `Sala con nombre "${name}" eliminada correctamente`
      });
    } catch (error) {
      console.error("Error al eliminar la sala:", error);
      return res.status(500).json({
        error: "Error al eliminar la sala"
      });
    }
  }

  // Actualizar una sala
  static async updateRoom(req, res) {
    const { id, name, capacity, seats, reservedSeats } = req.body;

    // Validación de entradas
    if (!id || !name || !capacity) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: id, name, capacity"
      });
    }

    const params = {
      TableName: "RoomsTable",
      Key: {
        id: id // ID de la sala que queremos actualizar
      },
      UpdateExpression: "set name = :name, capacity = :capacity",
      ExpressionAttributeValues: {
        ":name": name,
        ":capacity": capacity,
        ":seats": seats,
        ":reservedSeats": reservedSeats
      },
      ReturnValues: "UPDATED_NEW" // Para retornar solo los valores actualizados
    };

    try {
      const result = await dynamoDb.update(params).promise();

      res.status(200).json({
        message: "Sala actualizada correctamente",
        updatedRoom: result.Attributes // Los valores actualizados
      });
    } catch (error) {
      console.error("Error al actualizar la sala:", error);
      res.status(500).json({
        error: "Error al actualizar la sala"
      });
    }
  }
}

module.exports = RoomService;
