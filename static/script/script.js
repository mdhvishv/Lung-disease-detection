document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('upload-input');
    const uploadButton = document.getElementById('upload-button');
    const resultText = document.getElementById('result-text');
    const uploadedImage = document.getElementById('uploaded-image');
    const predictButton = document.getElementById('predict-button');

    uploadButton.addEventListener('click', () => {
        const file = uploadInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            // Display uploaded image
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedImage.src = event.target.result;
                uploadedImage.style.display = 'block';
            };
            reader.readAsDataURL(file);

            predictButton.style.display = 'block';
        }
    });

    predictButton.addEventListener('click', () => {
        const file = uploadInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                resultText.textContent = 'Prediction: ' + data.prediction;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
