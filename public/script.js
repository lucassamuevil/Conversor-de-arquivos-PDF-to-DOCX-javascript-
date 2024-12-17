const convertBtn = document.getElementById("convertBtn");
const pdfFileInput = document.getElementById("pdfFile");
const downloadLink = document.getElementById("downloadLink");

convertBtn.addEventListener('click', () => {
    const file = pdfFileInput.files[0];
    
    if (!file) {
        alert("Por favor, selecione um arquivo PDF.");
        return;
    }
    
    const formData = new FormData();
    formData.append("file", file);

    // Enviar o arquivo para o servidor
    fetch('http://localhost:3000/convert', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.blob())  // A resposta será um blob (arquivo convertido)
    .then(blob => {
        // Criar um link para o download do arquivo convertido
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'inline-block';  // Tornar o link visível
    })
    .catch(error => {
        alert("Erro ao converter o arquivo: " + error.message);
    });
});
