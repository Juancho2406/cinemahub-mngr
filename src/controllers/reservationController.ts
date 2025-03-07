import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: "us-east-1" }); // Usamos la región en la que SES está habilitado

class ReservationService {

  static async createReservation(req, res) {
    const { movieId, roomId, reservedSeats, email, sendConfirmationEmail,movieName,roomName } = req.body;

    if (!movieId || !roomId || !reservedSeats || !email) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: movieId, roomId, reservedSeats, email"
      });
    }

    const id = `${Date.now()}`;

    const params = {
      TableName: "ReservationsTable",
      Item: {
        id: id,
        cedula: 1005344097,
        movieName: movieName,
        roomName: roomName,
        reservedSeats: reservedSeats,
        email: email,
        createdAt: new Date().toISOString() 
      }
    };

    try {
      await dynamoDb.put(params).promise();

      if (sendConfirmationEmail) {
        const emailParams = {
          Source: "juansaavedra2406@gmail.com",
          Destination: {
            ToAddresses: [email]
          },
          Message: {
            Subject: {
              Data: "Confirmación de reserva"
            },
            Body: {
              Text: {
                Data: `¡Hola!\n\nTu reserva para la película con ID ${movieId} "${movieName}" en la sala ${roomId} ha sido confirmada.\n\nNúmero de asientos reservados: ${reservedSeats}\n\nGracias por elegirnos.`
              }
            }
          }
        };

        await ses.sendEmail(emailParams).promise();
      }

      return res.status(201).json(params.Item); 
    } catch (error) {
      console.error("Error al crear la reserva o enviar el correo:", error);
      return res.status(500).json({
        error: "Error al crear la reserva o enviar el correo"
      });
    }
  }

  
  static async getReservations(req, res) {
    const params = {
      TableName: "ReservationsTable"
    };

    try {
      const result = await dynamoDb.scan(params).promise();
      res.status(200).json(result.Items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener las reservas" });
    }
  }

  static async deleteReservation(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: id"
      });
    }

    const params = {
      TableName: "ReservationsTable",
      Key: {
        id: id
      }
    };

    try {
      await dynamoDb.delete(params).promise();
      return res.status(200).json({
        message: `Reserva con ID ${id} eliminada correctamente`
      });
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      return res.status(500).json({
        error: "Error al eliminar la reserva"
      });
    }
  }

  static async updateReservation(req, res) {
    console.log("Llego la solicitud",req.body)
    const { id, movieId, roomId, reservedSeats, email, sendConfirmationEmail } = req.body;

  
    if (!id || !movieId || !roomId || !reservedSeats || !email) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: id, movieId, roomId, reservedSeats, email"
      });
    }
    const params = {
      TableName: "ReservationsTable",
      Key: {
        id: id
      },
      UpdateExpression: "set movieId = :movieId, roomId = :roomId, reservedSeats = :seats, email = :email, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":movieId": movieId,
        ":roomId": roomId,
        ":seats": reservedSeats,
        ":email": email,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "UPDATED_NEW"
    };

    try {
      const result = await dynamoDb.update(params).promise();

      if (sendConfirmationEmail) {
        const emailParams = {
          Source: "juansaavedra2406@gmail.com",
          Destination: {
            ToAddresses: [email]
          },
          Message: {
            Subject: {
              Data: "Confirmación de actualización de reserva"
            },
            Body: {
              Text: {
                Data: `¡Hola!\n\nTu reserva para la película con ID ${movieId} en la sala ${roomId} ha sido actualizada.\n\nNúmero de asientos reservados: ${reservedSeats}\n\nGracias por elegirnos.`
              }
            }
          }
        };

        await ses.sendEmail(emailParams).promise();
      }

      return res.status(200).json({
        message: "Reserva actualizada correctamente",
        updatedReservation: result.Attributes
      });
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      return res.status(500).json({
        error: "Error al actualizar la reserva"
      });
    }
  }
}

module.exports = ReservationService;
