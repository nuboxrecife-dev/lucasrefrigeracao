// Lucas Refrigeração - Main JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION DRAWER
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.pageYOffset + 100; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Add scrolled class to header
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ==========================================
    // 2. HERO SLIDESHOW / CAROUSEL
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Handle wrap-arounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Reset classes
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Activate target
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Controls listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    // Dots listeners
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showSlide(index);
            resetInterval();
        });
    });

    // Slideshow Auto-play
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Pause on hover
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', startInterval);
    }

    // Init slider
    if (slides.length > 0) {
        startInterval();
    }

    // ==========================================
    // 3. INTERACTIVE BTU CALCULATOR
    // ==========================================
    const btnCalculate = document.getElementById('btnCalculate');
    const btnApplyBtu = document.getElementById('btnApplyBtu');
    const areaInput = document.getElementById('area');
    const sunInput = document.getElementById('sun');
    const peopleInput = document.getElementById('people');
    const appliancesInput = document.getElementById('appliances');
    
    const calcResult = document.getElementById('calcResult');
    const btuValueDisplay = document.getElementById('btuValue');
    const btuSuggestion = document.getElementById('btuSuggestion');
    
    let calculatedRecommendedBtuStr = "9.000 BTUs"; // Default state

    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            const area = parseFloat(areaInput.value);
            const sun = sunInput.value;
            const people = parseInt(peopleInput.value) || 1;
            const appliances = parseInt(appliancesInput.value) || 0;

            if (isNaN(area) || area <= 0) {
                alert('Por favor, insira uma área válida maior que 0.');
                areaInput.focus();
                return;
            }

            // Calculation Constants
            // Morning sun / low exposure: 600 BTUs per m²
            // Afternoon sun / high exposure: 800 BTUs per m²
            const factorPerSqm = (sun === 'afternoon') ? 800 : 600;
            
            // Base calculation
            let calculatedBtu = area * factorPerSqm;
            
            // Additional factors
            // First person is already calculated in the base. Additional people add 600 BTUs
            if (people > 1) {
                calculatedBtu += (people - 1) * 600;
            }
            // Electronic appliances add 600 BTUs each
            if (appliances > 0) {
                calculatedBtu += appliances * 600;
            }

            // Standard Brazilian commercial BTU sizes mapping
            const standardSizes = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
            let standardBtu = standardSizes[0];

            for (let size of standardSizes) {
                if (calculatedBtu <= size) {
                    standardBtu = size;
                    break;
                }
                // If it exceeds the largest size (60.000), default to it or multiple
                standardBtu = size; 
            }

            // Format strings for presentation
            const formattedBtu = standardBtu.toLocaleString('pt-BR') + ' BTUs';
            calculatedRecommendedBtuStr = formattedBtu; // Save for apply button
            
            btuValueDisplay.textContent = formattedBtu;

            // Generate customized advice based on parameters
            let advice = 'Recomendamos um aparelho Split Inverter. ';
            if (standardBtu >= 18000) {
                advice += 'Para esta potência, aparelhos Inverter economizam até 60% de energia em relação aos tradicionais.';
            } else if (sun === 'afternoon') {
                advice += 'Como a incidência solar é forte à tarde, a tecnologia Inverter manterá a temperatura ideal sem picos de consumo.';
            } else {
                advice += 'Ideal para manter o ambiente fresco com excelente eficiência e baixo ruído.';
            }

            btuSuggestion.textContent = advice;

            // Reveal result card with animation
            calcResult.style.display = 'block';
            calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Apply button to load BTU into step 2 selector
    if (btnApplyBtu) {
        btnApplyBtu.addEventListener('click', () => {
            const btuPowerSelect = document.getElementById('btuPower');
            if (btuPowerSelect) {
                // Find matching option
                let matched = false;
                for (let option of btuPowerSelect.options) {
                    if (option.value.includes(calculatedRecommendedBtuStr.split(' ')[0])) {
                        btuPowerSelect.value = option.value;
                        matched = true;
                        break;
                    }
                }
                
                // If calculated size is huge
                if (!matched && calculatedRecommendedBtuStr.includes('30.000')) {
                    btuPowerSelect.value = '30.000 BTUs ou mais';
                }

                // Scroll to booking form
                const agendarSection = document.getElementById('agendar');
                agendarSection.scrollIntoView({ behavior: 'smooth' });

                // Highlight step 2 selection by advancing there or notifying
                alert(`Selecionamos a potência de ${calculatedRecommendedBtuStr} no seu formulário de agendamento abaixo! Complete seus dados para finalizar.`);
            }
        });
    }

    // ==========================================
    // 4. MULTI-STEP BOOKING FORM
    // ==========================================
    const bookingForm = document.getElementById('bookingForm');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    
    let currentStepIndex = 0; // 0 = Step 1, 1 = Step 2, 2 = Step 3

    // Service Option Selection Behavior
    const serviceOptions = document.querySelectorAll('.service-option');
    serviceOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            serviceOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            // Check the internal radio button
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    function updateFormSteps() {
        // Toggle steps active visibility
        formSteps.forEach((step, idx) => {
            if (idx === currentStepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update progress line width attribute
        if (progressBarContainer) {
            progressBarContainer.setAttribute('data-step', currentStepIndex + 1);
        }

        // Update indicator dots active/completed states
        stepIndicators.forEach((indicator, idx) => {
            const stepNum = idx + 1;
            if (stepNum < currentStepIndex + 1) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
                indicator.innerHTML = '✓'; // Completed tick
            } else if (stepNum === currentStepIndex + 1) {
                indicator.classList.remove('completed');
                indicator.classList.add('active');
                indicator.innerHTML = stepNum;
            } else {
                indicator.classList.remove('completed');
                indicator.classList.remove('active');
                indicator.innerHTML = stepNum;
            }
        });
    }

    // Go to next step
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validate step inputs before proceeding
            if (currentStepIndex === 1) {
                const bairroInput = document.getElementById('bairro');
                if (bairroInput && !bairroInput.value.trim()) {
                    alert('Por favor, informe o bairro ou cidade do atendimento.');
                    bairroInput.focus();
                    return;
                }
            }
            
            if (currentStepIndex < formSteps.length - 1) {
                currentStepIndex++;
                updateFormSteps();
            }
        });
    });

    // Go to previous step
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                currentStepIndex--;
                updateFormSteps();
            }
        });
    });

    // Helper to select service externally (e.g. from PMOC button)
    window.selectService = function(serviceVal) {
        const optionToSelect = Array.from(serviceOptions).find(opt => {
            const radio = opt.querySelector('input[type="radio"]');
            return radio && radio.value.toLowerCase().includes(serviceVal.toLowerCase());
        });

        if (optionToSelect) {
            optionToSelect.click();
        }

        // Scroll to booking form
        document.getElementById('agendar').scrollIntoView({ behavior: 'smooth' });
    };

    // PMOC Special link binder
    const pmocBtnLink = document.getElementById('pmocBtnLink');
    if (pmocBtnLink) {
        pmocBtnLink.addEventListener('click', (e) => {
            e.preventDefault();
            selectService('PMOC Comercial');
        });
    }

    // Form Submission & Redirect to WhatsApp API
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate step 3 inputs
            const clientNameInput = document.getElementById('clientName');
            const clientPhoneInput = document.getElementById('clientPhone');
            const bairroInput = document.getElementById('bairro');
            
            if (!clientNameInput.value.trim()) {
                alert('Por favor, informe seu nome completo.');
                clientNameInput.focus();
                return;
            }
            if (!clientPhoneInput.value.trim()) {
                alert('Por favor, informe um WhatsApp para contato.');
                clientPhoneInput.focus();
                return;
            }
            if (!bairroInput.value.trim()) {
                alert('Por favor, informe o local de atendimento (Bairro/Cidade).');
                currentStepIndex = 1; // Return to step 2
                updateFormSteps();
                bairroInput.focus();
                return;
            }

            // Collect variables
            const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
            const btuPower = document.getElementById('btuPower').value;
            const machineType = document.getElementById('machineType').value;
            const bairro = bairroInput.value.trim();
            const clientName = clientNameInput.value.trim();
            const clientPhone = clientPhoneInput.value.trim();
            const observations = document.getElementById('observations').value.trim();

            // Format message details
            let messageText = `Olá Lucas Refrigeração! Gostaria de agendar um atendimento/orçamento pelo site.\n\n`;
            messageText += `*Detalhes da Solicitação:*\n`;
            messageText += `• *Serviço:* ${serviceType}\n`;
            messageText += `• *Aparelho:* ${machineType}\n`;
            messageText += `• *Potência:* ${btuPower}\n`;
            messageText += `• *Bairro/Cidade:* ${bairro}\n\n`;
            messageText += `*Dados de Contato:*\n`;
            messageText += `• *Nome:* ${clientName}\n`;
            messageText += `• *WhatsApp do Cliente:* ${clientPhone}\n`;
            
            if (observations) {
                messageText += `\n*Observações Adicionais:*\n${observations}\n`;
            }

            // Encode message text
            const encodedText = encodeURIComponent(messageText);
            
            // Lucas WhatsApp number (extracted from Instagram posts: (11) 96177-8917)
            const targetPhone = "5511961778917";
            const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;

            // Reset form steps & fields
            alert('Tudo pronto! Você será redirecionado para o WhatsApp para enviar os detalhes do agendamento.');
            bookingForm.reset();
            currentStepIndex = 0;
            updateFormSteps();
            
            // Redirect window to WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }

    // ==========================================
    // 5. ACCORDION FAQ LOGIC
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Check if active
            const isActive = faqItem.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // If it wasn't active, activate it
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. WHATSAPP INTERACTIVE POPUP LOGIC
    // ==========================================
    const waPopup = document.getElementById('waPopup');
    const closeWaPopup = document.getElementById('closeWaPopup');
    const waFloatBtn = document.getElementById('waFloatBtn');

    if (waPopup && closeWaPopup) {
        // Exibir o popup após 4 segundos
        setTimeout(() => {
            // Verificar se o usuário já fechou o popup nesta sessão
            if (!sessionStorage.getItem('waPopupClosed')) {
                waPopup.classList.add('show');
            }
        }, 4000);

        // Fechar o popup ao clicar no botão "x"
        closeWaPopup.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            waPopup.classList.remove('show');
            sessionStorage.setItem('waPopupClosed', 'true');
        });

        // Fechar o popup ao clicar no botão de iniciar conversa
        const btnWaPopup = waPopup.querySelector('.btn-wa-popup');
        if (btnWaPopup) {
            btnWaPopup.addEventListener('click', () => {
                waPopup.classList.remove('show');
                sessionStorage.setItem('waPopupClosed', 'true');
            });
        }

        // Se o usuário clicar no próprio botão flutuante, fecha o popup também
        if (waFloatBtn) {
            waFloatBtn.addEventListener('click', () => {
                waPopup.classList.remove('show');
                sessionStorage.setItem('waPopupClosed', 'true');
            });
        }
    }

});
