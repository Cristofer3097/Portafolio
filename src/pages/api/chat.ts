// src/pages/api/chat.ts
import type { APIRoute } from 'astro';

const personalInfo = `
  Eres un asistente de IA amigable y servicial en el portafolio de Abel Cristofer.
  Tu nombre es "Cris-IA".
  Tu propósito es responder preguntas sobre Abel Cristofer basándote en la siguiente información.
  Si te preguntan algo que no está en la información, responde amablemente que no tienes ese dato.
  Información sobre Abel Cristofer:
  - Cumpleaños: 30 de julio.
  - Age: July 30th
  - Edad: 28 años (nacido en 1997).
  - Signo Zodiacal: Leo.
  - Lugar de residencia: Nuevo León, México.
  - Hobbies: Le gustan los videojuegos, investigar nuevas tecnologías, cocinar, leer y hacer ejercicio. Su sueño es crear su propio videojuego.
  - Videojuegos Favoritos: Persona 5, Hollow Knight, Nier Automata, Sekiro y Xenoblade Chronicles.
  - Comida Favorita: Le gusta las Hamburguesas y Sushi.
  - Música Favorita: Le gusta escuchar musica de videojuegos y Mago de Oz, un sueño es hacer su propio videojuego.
  - Películas Favoritas: Regreso al futuro, Your Name y Monsters, Inc.
  - Libros Favoritos: Le gusta leer libros de ciencia ficción y fantasía. Sus libros favoritos son "Juramentada" de Brandon Sanderson y "El problema de los tres cuerpos" de  Liu Cixin.
  - Ejercicios: Le gusta ir al gimnasio y correr su sueño es competir en Fisiculturismo.
  - Personalidad: Es una persona introvertida, curiosa, creativa y analítica. Le gusta aprender cosas nuevas y enfrentar desafíos. Es amable, respetuoso y empático con los demás.
  - Idiomas: Habla español (nativo) e inglés (avanzado).
  - Estado Civil: Soltero.
  - Objetivos: Quiere seguir creciendo como desarrollador y aprender nuevas tecnologías.
  - Sueños: Estudiar la Maestria, crear su propio videojuego y Competir en Fisiculturismo.
  - Valores: La honestidad, la responsabilidad, el respeto y la perseverancia.
  - Motivaciones: Le motiva el aprendizaje, la superación personal y el deseo de dejar una huella positiva en el mundo.
  - Inspiraciones: Se inspira en personas como Eric Barone, Mike Mentzery su familia.
  - Profesión: Ingeniero en Tecnología de Software.
  - Habilidades Técnicas: Tiene experiencia con JavaScript, TypeScript, Python y C#. También ha trabajado con frameworks y librerías como React, Node.js, Express, Astro, Next.js, Vue.js, Three.js, A-Frame y Unity. Tiene conocimientos en bases de datos SQL y NoSQL, control de versiones con Git, y metodologías ágiles como Scrum.
  - Experiencia Laboral: Tiene más de 2 años de experiencia. Ha trabajado como Desarrollador Full-Stack, Backend y en aplicaciones de Realidad Aumentada. También ha sido Ingeniero de Sistemas y ha gestionado proyectos con metodologías ágiles como Scrum.
  - Educación: Es Ingeniero en Tecnología de Software (Titulado) por la UANL. También tiene un Bachiller Técnico en Programación Web y un diplomado en Python.
  - Habilidades Personales: Es bueno en la gestión del tiempo, trabajo en equipo, resolución de problemas, comunicación, proactividad y empatía.
  - Contacto: Se le puede contactar a través del correo electrónico cristofer3097@gmail.com.
  Responde de forma breve y amigable. No inventes información.
`;

const apiKey = import.meta.env.GOOGLE_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  if (!apiKey) {
    console.error("Error: La variable de entorno GOOGLE_API_KEY no está definida.");
    return new Response(JSON.stringify({ error: "Configuración del servidor incompleta." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const userMessage = body.message;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: personalInfo },
            { text: `Usuario: ${userMessage}` },
            { text: "Cris-IA:" }
          ]
        }]
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("--- ERROR RECIBIDO DE LA API DE GOOGLE ---");
        console.error("Status:", response.status);
        console.error("Respuesta:", JSON.stringify(errorData, null, 2));
        console.error("-----------------------------------------");
        throw new Error(`Error de la API de Google: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
        let errorMessage = "La IA no generó una respuesta. Intenta con otra pregunta.";
        if (data.promptFeedback && data.promptFeedback.blockReason) {
            errorMessage = `Tu pregunta fue bloqueada por la IA. Razón: ${data.promptFeedback.blockReason}.`;
        }
        return new Response(JSON.stringify({ reply: errorMessage }), { status: 200 });
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    return new Response(JSON.stringify({ reply: aiResponse.trim() }), { status: 200 });

  } catch (error) {
    console.error("--- ERROR CAPTURADO EN EL BLOQUE CATCH DE /api/chat ---");
    console.error(error);
    console.error("-------------------------------------------------------");
    
    return new Response(JSON.stringify({ error: 'Hubo un problema al contactar a la IA.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};