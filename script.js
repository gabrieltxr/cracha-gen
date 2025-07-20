document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const elements = {
        employeePhoto: document.getElementById('employeePhoto'),
        photoPreview: document.getElementById('photoPreview'),
        photoPlaceholder: document.getElementById('photoPlaceholder'),
        badgePhoto: document.getElementById('badgePhoto'),
        zoomIn: document.getElementById('zoomIn'),
        zoomOut: document.getElementById('zoomOut'),
        resetZoom: document.getElementById('resetZoom'),
        zoomValue: document.getElementById('zoomValue'),
        resizeControls: document.querySelector('.resize-controls'),
        photoUploadContainer: document.getElementById('photoUploadContainer'),
        generateBtn: document.getElementById('generateBtn'),
        employeeName: document.getElementById('employeeName'),
        employeePosition: document.getElementById('employeePosition'),
        employeeId: document.getElementById('employeeId'),
        previewName: document.getElementById('previewName'),
        previewPosition: document.getElementById('previewPosition'),
        previewId: document.getElementById('previewId'),
        printBtn: document.getElementById('printBtn'),
        exportImageBtn: document.getElementById('exportImageBtn'),
        resetBtn: document.getElementById('resetBtn'),
        badgePreview: document.getElementById('badgePreview'),
        modalPreview: document.getElementById('modalPreview'),
        closeModal: document.querySelector('.close'),
        modalBadgePreview: document.getElementById('modalBadgePreview')
    };

    const typeButtons = document.querySelectorAll('.type-btn');
    const rqeGroup = document.getElementById('rqeGroup');
    const previewRqe = document.getElementById('previewRqe');
    const employeeRqe = document.getElementById('employeeRqe');

    // Estado da foto
    let photoState = {
        scale: 1,
        x: 0,
        y: 0,
        naturalWidth: 0,
        naturalHeight: 0,
        originalImageSrc: null
    };

    // Verifica se todos os elementos necessários existem
    function validateElements() {
        for (const key in elements) {
            if (!elements[key]) {
                console.error(`Elemento não encontrado: ${key}`);
                return false;
            }
        }
        return true;
    }

    if (!validateElements()) {
        alert('Erro ao carregar a aplicação. Verifique o console para mais detalhes.');
        return;
    }

    // Atualiza transformação da imagem
    function applyTransform() {
        const img = elements.photoPreview;
        const zoomValue = elements.zoomValue;
        if (!img || !zoomValue) return;

        const transform = `translate(-50%, -50%) translate(${photoState.x}px, ${photoState.y}px) scale(${photoState.scale})`;
        img.style.transform = transform;
        zoomValue.textContent = `${Math.round(photoState.scale * 100)}%`;

        applyBadgeTransform();
    }

    function applyBadgeTransform() {
        const badgePhoto = elements.badgePhoto;
        if (!badgePhoto || !photoState.originalImageSrc) return;

        const transform = `translate(-50%, -50%) translate(${photoState.x}px, ${photoState.y}px) scale(${photoState.scale})`;
        badgePhoto.style.transform = transform;

        badgePhoto.dataset.transform = JSON.stringify({
            x: photoState.x,
            y: photoState.y,
            scale: photoState.scale
        });
    }

    // Gerar crachá
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', function() {
            if (elements.previewName) {
                elements.previewName.textContent = elements.employeeName.value || 'Nome do Funcionário';
            }
            if (elements.previewPosition) {
                elements.previewPosition.textContent = elements.employeePosition.value || 'Cargo/Função';
            }
            if (elements.previewId) {
                elements.previewId.textContent = elements.employeeId.value || 'Matrícula';
            }
        });
    }

        
// Imprimir crachá
    if (elements.printBtn) {
        elements.printBtn.addEventListener('click', function() {
            if (!confirm('Pronto para imprimir o crachá?')) return;

            const printTransform = elements.badgePhoto.dataset.transform 
                ? JSON.parse(elements.badgePhoto.dataset.transform)
                : { x: 0, y: 0, scale: 1 };

            const badgeClone = elements.badgePreview.cloneNode(true);
            badgeClone.removeAttribute('id');
            const elementsWithId = badgeClone.querySelectorAll('[id]');
            elementsWithId.forEach(el => el.removeAttribute('id'));

            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.width = '0';
            printFrame.style.height = '0';
            printFrame.style.border = '0';
            printFrame.style.visibility = 'hidden';
            document.body.appendChild(printFrame);

            const printDoc = printFrame.contentDocument || printFrame.contentWindow.document;
            printDoc.open();
            printDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Impressão de Crachá</title>
                    <style>
                        @page {
                            size: 54mm 86mm;
                            margin: 0;
                            padding: 0;
                        }
                        body {
                            margin: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            padding: 0;
                            width: 53.98mm;
                            height: 85.60mm;
                            background: white !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            overflow: hidden;
                            text-transform: uppercase;
                        }
                        .badge {
                            width: 53.98mm;
                            height: 85.60mm;
                            background: white;
                            box-shadow: none;
                            display: flex;
                            flex-direction: column;
                            padding: 2mm;
                            margin: 0;
                            position: relative;
                            box-sizing: border-box;
                            overflow: hidden;
                        }
                        .badge-header {
                            height: 22mm;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 1mm;
                        }
                        .logo-fixa {
                            max-height: 18mm;
                            max-width: 45mm;
                            width: auto;
                            height: auto;
                            display: block;
                            margin: 0 auto;
                            padding: 1mm 0;
                        }
                        .badge-content {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                            padding-top: 1mm;
                        }
                        .photo-preview {
                            width: 36.8mm;
                            height: 36.8mm;
                            border-radius: 0;
                            border: 0.6mm solid #ddd;
                            overflow: hidden;
                            margin: 1mm auto 2mm;
                            background: #f5f5f5;
                            position: relative;
                        }
                        .photo-preview img {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            transform: translate(-50%, -50%) translate(${printTransform.x}px, ${printTransform.y}px) scale(${printTransform.scale});
                            transform-origin: center center;
                        }
                        .badge-name {
                            font-size: 13pt;
                            font-weight: bold;
                            text-align: center;
                            margin: 1mm 0;
                            max-width: 50mm;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            line-height: 1.2;
                        }
                        .badge-position {
                            font-size: 11pt;
                            text-align: center;
                            margin: 0 0 2mm;
                            color: #555;
                            font-weight: bold;
                        }
                        .badge-rqe::before {
                            font-size: 10pt;
                            content: "RQE nº: ";
                            text-transform: none;
                        }   
                        .badge-id {
                            font-size: 12pt;
                            text-align: center;
                            color: #000000;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    ${badgeClone.outerHTML}
                </body>
                </html>
            `);
            printDoc.close();

            setTimeout(() => {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
                setTimeout(() => {
                    if (printFrame.parentNode) {
                        document.body.removeChild(printFrame);
                    }
                }, 2000);
            }, 500);
        });
    }
    function centerImage() {
        const container = elements.photoUploadContainer;
        const img = elements.photoPreview;
        if (!container || !img) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (photoState.naturalWidth === 0 || photoState.naturalHeight === 0) {
            photoState.naturalWidth = img.naturalWidth;
            photoState.naturalHeight = img.naturalHeight;
        }

        const imgRatio = photoState.naturalWidth / photoState.naturalHeight;
        const containerRatio = containerWidth / containerHeight;

        let scale;
        if (imgRatio > containerRatio) {
            scale = containerWidth / photoState.naturalWidth;
        } else {
            scale = containerHeight / photoState.naturalHeight;
        }

        photoState.scale = scale;
        photoState.x = 0;
        photoState.y = 0;

        applyTransform();
    }

    function updateBadgePhoto() {
        const badgePhoto = elements.badgePhoto;
        if (!badgePhoto || !photoState.originalImageSrc) return;

        badgePhoto.src = photoState.originalImageSrc;
        applyBadgeTransform();
    }

    function updateBadgeTypeClass(type) {
        elements.badgePreview.classList.remove('badge-type-funcionario', 'badge-type-medico');
        elements.badgePreview.classList.add(`badge-type-${type}`);
    }

    function validateForm() {
        const requiredFields = [
            elements.employeeName,
            elements.employeePosition,
            elements.employeeId,
            elements.employeePhoto
        ];
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        return isValid;
    }

    function setupPhotoUpload() {
        const fileInput = elements.employeePhoto;
        const photoPreview = elements.photoPreview;
        const placeholder = elements.photoPlaceholder;
        const resizeControls = elements.resizeControls;

        placeholder.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoState.originalImageSrc = event.target.result;
                    photoPreview.src = event.target.result;
                    photoPreview.style.display = 'block';
                    placeholder.style.display = 'none';
                    resizeControls.style.display = 'flex';

                    photoPreview.onload = function() {
                        photoState.naturalWidth = photoPreview.naturalWidth;
                        photoState.naturalHeight = photoPreview.naturalHeight;
                        centerImage();
                        updateBadgePhoto();
                    };
                };
                reader.readAsDataURL(file);
            } else {
                alert('Por favor, selecione um arquivo de imagem válido.');
                fileInput.value = '';
            }
        });
    }

    // Drag da imagem
    function setupImageDrag() {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startTransformX = 0;
        let startTransformY = 0;

        elements.photoPreview.addEventListener('mousedown', function(e) {
            if (photoState.originalImageSrc) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startTransformX = photoState.x;
                startTransformY = photoState.y;
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                photoState.x = startTransformX + deltaX;
                photoState.y = startTransformY + deltaY;
                applyTransform();
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // Touch support
        elements.photoPreview.addEventListener('touchstart', function(e) {
            if (photoState.originalImageSrc) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTransformX = photoState.x;
                startTransformY = photoState.y;
                e.preventDefault();
            }
        });

        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const deltaX = e.touches[0].clientX - startX;
                const deltaY = e.touches[0].clientY - startY;
                photoState.x = startTransformX + deltaX;
                photoState.y = startTransformY + deltaY;
                applyTransform();
                e.preventDefault();
            }
        });

        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    }

    // Zoom
    function setupZoomControls() {
        elements.zoomIn.addEventListener('click', function() {
            photoState.scale = Math.min(3, photoState.scale + 0.1);
            applyTransform();
        });

        elements.zoomOut.addEventListener('click', function() {
            photoState.scale = Math.max(0.5, photoState.scale - 0.1);
            applyTransform();
        });

        elements.resetZoom.addEventListener('click', function() {
            centerImage();
        });
    }

    // Botões de tipo
    function setupTypeButtons() {
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                typeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const selectedType = button.dataset.type;
                updateBadgeTypeClass(selectedType);

                if (selectedType === 'medico') {
                    rqeGroup.style.display = 'block';
                    previewRqe.style.display = 'block';
                } else {
                    rqeGroup.style.display = 'none';
                    previewRqe.style.display = 'none';
                }

                previewRqe.textContent = employeeRqe.value || '';
            });
        });
    }
    // Botão gerar crachá
    function setupGenerateButton() {
        elements.generateBtn.addEventListener('click', function() {
            if (!validateForm()) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            elements.previewName.textContent = elements.employeeName.value || 'Nome do Funcionário';
            elements.previewPosition.textContent = elements.employeePosition.value || 'Cargo/Função';
            elements.previewId.textContent = elements.employeeId.value || 'Matrícula';
            previewRqe.textContent = employeeRqe.value || '';
        });
    }

    // Reset
    function setupResetButton() {
        elements.resetBtn.addEventListener('click', function() {
            if (confirm('Deseja limpar todos os dados? A página será recarregada.')) {
                window.location.reload();
            }
        });
    }

    // Exportar imagem
    function setupExportButton() {
        elements.exportImageBtn.addEventListener('click', function() {
            if (!validateForm()) {
                alert('Por favor, preencha todos os campos obrigatórios antes de exportar.');
                return;
            }

            if (typeof html2canvas !== 'undefined') {
                html2canvas(elements.badgePreview, {
                    scale: 2,
                    logging: false,
                    useCORS: true
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'cracha.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(error => {
                    console.error('Erro ao exportar imagem:', error);
                    alert('Erro ao exportar imagem.');
                });
            } else {
                alert('html2canvas não encontrado.');
            }
        });
    }

    // Inicializar todos os componentes
    function initialize() {
        setupPhotoUpload();
        setupImageDrag();
        setupZoomControls();
        setupTypeButtons();
        setupGenerateButton();
        setupResetButton();
        setupExportButton();
        setupPrintFunctionality();
        setupModal();
        
        // Atualizar campos em tempo real
        elements.employeeName.addEventListener('input', function() {
            elements.previewName.textContent = this.value || 'Nome do Funcionário';
        });
        
        elements.employeePosition.addEventListener('input', function() {
            elements.previewPosition.textContent = this.value || 'Cargo/Função';
        });
        
        elements.employeeId.addEventListener('input', function() {
            elements.previewId.textContent = this.value || 'Matrícula';
        });
        
        employeeRqe.addEventListener('input', function() {
            previewRqe.textContent = this.value || '';
        });
    }

    // Iniciar a aplicação
    initialize();
});