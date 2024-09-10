/// Inicia el reconocimiento de voz automáticamente al cargar la página
window.onload = function() {
    startRecognition();
};

let recognition;

function startRecognition() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES'; // Cambia esto al idioma que prefieras
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;  // Habilita el reconocimiento continuo

        recognition.onresult = async function(event) {
            console.log("Evento onresult capturado");
            const textVoice = event.results[event.results.length - 1][0].transcript;
            console.log("Transcripción capturada:", textVoice);
            document.getElementById('capture').textContent = `${textVoice}`;

            // Traduce el texto capturado
            await translateText(textVoice, 'en', 'ingles');
            await translateText(textVoice, 'ja', 'japones');
        };

        recognition.onerror = function(event) {
            console.error('Error en el reconocimiento de voz:', event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                alert('Permiso de micrófono denegado o no disponible.');
            } else {
                // Reinicia el reconocimiento de voz en caso de error
                recognition.stop();
                setTimeout(() => recognition.start(), 1000);
            }
        };

        recognition.onend = function() {
            console.log('Reconocimiento de voz detenido. Reiniciando...');
            setTimeout(() => recognition.start(), 1000);
        };
    }

    recognition.start();
    console.log("Reconocimiento de voz iniciado");
}

// Función para traducir el texto usando la API de Google
async function translateText(text, targetLang, elementId) {
    console.log(`Traduciendo "${text}" a ${targetLang}`);
    const apiKey = 'AIzaSyCGVBvPaLSWzCr7_gta--vjKgtrIw_pX8g'; // Asegúrate de usar una API Key válida
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            q: text,
            target: targetLang,
            format: 'text'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();
    console.log("Resultado de la traducción:", result);
    const translatedText = result.data.translations[0].translatedText;

    document.getElementById(elementId).textContent = `${translatedText}`;
}