import AWS from 'aws-sdk'

const nodemailer = require('nodemailer');

// Configurar SES
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1'
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Configurar el transporte de Nodemailer para usar SES
const transporter = nodemailer.createTransport({
  SES: ses
});

// Configurar y enviar el correo
const mailOptions = {
  from: 'juansaavedra2406@gmail.com',
  to: 'recipient@example.com',
  subject: 'Reserva Confirmada',
  text: 'Tu reserva ha sido realizada con éxito.'
};

transporter.sendMail(mailOptions, (error:any, info:any) => {
  if (error) {
    console.log('Error al enviar correo:', error);
  } else {
    console.log('Correo enviado:', info.response);
  }
});
