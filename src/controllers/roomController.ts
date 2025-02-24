import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class RoomService {
  
  static async createRoom(req, res) {
    const { name, capacity, seats, reservedSeats } = req.body;
    const id = `${Date.now()}`;
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
      await dynamoDb.put(params).promise();
      res.status(201).json(params.Item); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la sala" });
    }
  }

  
  static async getRooms(req, res) {
    const params = {
      TableName: "RoomsTable"
    };

    try {
      const result = await dynamoDb.scan(params).promise(); 
      res.status(200).json(result.Items);
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
  static async updateRoom(req, res) {
    const { id, name, capacity, seats, reservedSeats } = req.body;

    if (!id || !name || !capacity) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: id, name, capacity"
      });
    }

    const deleteParams = {
      TableName: "RoomsTable",
      Key: {
        id: id
      }
    };

    try {
      await dynamoDb.delete(deleteParams).promise();

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

      await dynamoDb.put(params).promise();

      res.status(200).json({
        message: "Sala actualizada correctamente",
        updatedRoom: params.Item
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
