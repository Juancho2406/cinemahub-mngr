import AWS from 'aws-sdk'
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' }); // Usamos la región en la que SES está habilitado


// Función para verificar si el correo electrónico está verificado en SES
const isEmailVerified = async (email) => {
  const params = {
    Identities: [email],
  };

  try {
    const result = await ses.getIdentityVerificationAttributes(params).promise();
    const verificationStatus = result.VerificationAttributes[email] ? result.VerificationAttributes[email].VerificationStatus : 'Not Verified';
    return verificationStatus === 'Success';
  } catch (error) {
try {
  
  await ses.sendCustomVerificationEmail(
    {
      EmailAddress: email,
      TemplateName: "",

    }
  ).promise();
} catch (error) {
  console.log("Error al enviar verificacion de correo")
}
    console.error('Error al verificar el correo electrónico:', error);
    throw new Error('Error al verificar el correo electrónico');
  }
};

const createReservation = async (req, res) => {
  const { movieId, roomId, seats, email, sendConfirmationEmail } = req.body; // Desestructuramos el flag `sendConfirmationEmail`

  // Validación de entradas
  if (!movieId || !roomId || !seats || !email) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios: movieId, roomId, seats, email' });
  }

  // Verificar si el correo electrónico está verificado
  const isVerified = await isEmailVerified(email);

  if (!isVerified) {
    // Si el correo no está verificado, enviar un correo de verificación
    const verificationParams = {
      EmailAddress: email,
    };

    try {
      // Enviar correo de verificación
      await ses.verifyEmailIdentity(verificationParams).promise();

      return res.status(400).json({
        error: 'El correo electrónico no está verificado. Por favor, verifica tu correo antes de continuar.',
        message: `Un correo de verificación ha sido enviado a ${email}. Haz clic en el enlace de verificación para completar el proceso.`,
      });
    } catch (error) {
      console.error('Error al enviar la solicitud de verificación:', error);
      return res.status(500).json({ error: 'Error al intentar enviar el correo de verificación.' });
    }
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
      seats: seats,         // Número de asientos reservados
      email: email,         // Correo electrónico del usuario
      createdAt: new Date().toISOString(), // Timestamp de creación
    },
  };

  // Intentar guardar la reserva en DynamoDB
  try {
    await dynamoDb.put(params).promise();

    if (sendConfirmationEmail) {
      const emailParams = {
        Source: 'juansaavedra2406@gmail.com',
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: 'Confirmación de reserva',
          },
          Body: {
            Text: {
              Data: `¡Hola!\n\nTu reserva para la película con ID ${movieId} en la sala ${roomId} ha sido confirmada.\n\nNúmero de asientos reservados: ${seats}\n\nGracias por elegirnos.`,
            },
          },
        },
      };

      await ses.sendEmail(emailParams).promise(); // Enviar el correo electrónico de confirmación
    }

    // Respuesta exitosa con la reserva creada
    return res.status(201).json({
      id: params.Item.id,
      movieId: params.Item.movieId,
      roomId: params.Item.roomId,
      seats: params.Item.seats,
      email: params.Item.email,
      createdAt: params.Item.createdAt,
    });
  } catch (error) {
    console.error('Error al crear la reserva o enviar el correo:', error);
    return res.status(500).json({ error: 'Error al crear la reserva o enviar el correo' });
  }
};

module.exports = { createReservation };


// Obtener todas las reservas
const getReservations = async (req, res) => {
  console.log("Request de reservas",req)
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
