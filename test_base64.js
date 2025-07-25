const Tesseract = require("tesseract.js");

async function testBase64Image(base64Data) {
  try {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const { data: { text } } = await Tesseract.recognize(
      imageBuffer,
      'eng',
    );
    console.log("Texto Transcrito:", text);
  } catch (error) {
    console.error("Erro ao processar imagem base64:", error);
  }
}

// Exemplo de uso com o base64 fornecido pelo usuário (apenas a parte da imagem)
const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAklEQVR4AewaftIAAAPVSURBVO3BUaobiBVEwdMX7X/LHf+FgBvyhEYj2acq/QVJv3VImg5J0yFpOiRNh6TpkDQdkqZD0nRImg5J0yFpOiRNh6TpkDQdkqZD0nRImg5J0yFpOiRNh6TpkDQdkqZD0nRImg5J0yFpevBmSfhmbXmnJCxteUYSvllb3uWQNB2SpkPSdEiaDknTIWl68EHa8gmS8GpJWNqytOWd2vIJkvAJDknTIWk6JE2HpOmQNB2SpgdfIgmv1pZXSsIzkvBqbXmlJLxaWz7dIWk6JE2HpOmQNB2SpkPS9ED/urY8Iwn6Zx2SpkPSdEiaDknTIWk6JE0P9BZtWZKgz3RImg5J00P9BZtWZKwJGFpy7u05RlJ+GaHpOmQNB2SpkPSdEiaDknTgy/Rlk/Xlldry6dLwp/qkDQdkqZD0nRImg5J0yFpevBBkvDNkrC05RlJWNryakn4nbYsbXlGEpa2fIJD0nRImg5J0yFpOiRNh6Qp/QVJv3VImg5J0yFpOiRNh6TpkDQdkqZD0nRImg5J0yFpOiRNh6TpkDQdkqZD0nRImg5J0yFpOiRNh6TpkDQdkqZD0nRImg5J038ArCoKmmn2xO0AAAAASUVORK5CYII=";
testBase64Image(base64Image);


