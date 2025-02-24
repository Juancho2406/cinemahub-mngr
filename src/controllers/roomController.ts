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

  static async deleteRoom(req, res) {
    const { id } = req.params; 
    console.log("request Delete", req.params)
    if (!id) {
      return res.status(400).json({
        error: "Falta el parámetro obligatorio: id"
      });
    }

    try {
      const deleteParams = {
        TableName: "RoomsTable",
        Key: {
          id: id 
        }
      };
      await dynamoDb.delete(deleteParams).promise();

      return res.status(200).json({
        message: `Sala con id "${id}" eliminada correctamente`
      });
    } catch (error) {
      console.error("Error al eliminar la sala:", error);
      return res.status(500).json({
        error: "Error al eliminar la sala"
      });
    }
  }

  // Emulamos un update usando delete y luego post
  static async updateRoom(req, res) {
    const { id, name, capacity, seats, reservedSeats } = req.body;

    if (!id || !name || !capacity) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: id, name, capacity"
      });
    }

    // Primero, eliminamos la sala existente con el mismo id
    const deleteParams = {
      TableName: "RoomsTable",
      Key: {
        id: id
      }
    };

    try {
      // Eliminamos la sala anterior
      await dynamoDb.delete(deleteParams).promise();

      // Ahora, creamos una nueva sala con los datos actualizados
      const params = {
        TableName: "RoomsTable",
        Item: {
          id: id, // Mantenemos el mismo id
          name,
          capacity,
          seats,
          reservedSeats
        }
      };

      // Insertamos la nueva sala
      await dynamoDb.put(params).promise();

      // Respondemos con el mensaje de éxito
      res.status(200).json({
        message: "Sala actualizada correctamente",
        updatedRoom: params.Item // Los valores actualizados
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
