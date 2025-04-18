module.exports = {
    getErrorResponse: (error) => {
        let statusCode = 500; // Por defecto, se asume un error interno del servidor
        let message = 'Internal server error'; // Mensaje por defecto

        // Determinar el código de estado y el mensaje basado en el tipo de error
        if (error instanceof SyntaxError) {
            // Si es un error de sintaxis en JSON
            statusCode = 400; // Bad Request
            message = 'Bad request: Malformed JSON';
        } else if (error instanceof ReferenceError) {
            // Si es un error de referencia (p. ej., variable no definida)
            statusCode = 500; // Internal Server Error
            message = 'Internal server error: Reference error';
        } else if (error instanceof TypeError) {
            // Si es un error de tipo (p. ej., método no definido)
            statusCode = 500; // Internal Server Error
            message = 'Internal server error: Type error';
        } // Puedes agregar más condiciones según tus necesidades

        return { statusCode, message };
    }
}
