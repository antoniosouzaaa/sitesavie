'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Lógica do menu mobile
    const primaryNav = document.querySelector('.primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    navToggle.addEventListener('click', () => {
        const isVisible = primaryNav.getAttribute('data-visible') === 'true';
        primaryNav.setAttribute('data-visible', !isVisible);
        navToggle.setAttribute('aria-expanded', !isVisible);
    });

    // Efeito de Aurora que segue o cursor
    const body = document.body;
    if (body) {
        window.addEventListener('mousemove', (e) => {
            body.style.setProperty('--mouse-x', `${e.clientX}px`);
            body.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }

    // Animação de chat na seção Hero
    const heroTypingIndicator = document.getElementById('hero-typing-indicator');
    const heroBotResponse = document.getElementById('hero-bot-response');
    if (heroTypingIndicator && heroBotResponse) {
        setTimeout(() => {
            heroTypingIndicator.style.display = 'none';
            heroBotResponse.classList.remove('hidden');
        }, 2500);
    }

    // Header dinâmico ao rolar
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Animação de entrada ao rolar (Intersection Observer)
    const animatedElements = document.querySelectorAll('.step, .bento-card');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // Simulador de Comandos Interativo
    const commandInput = document.getElementById('command-input');
    const sendBtn = document.getElementById('send-command-btn');
    const outputArea = document.getElementById('simulator-output');

    if (commandInput && sendBtn && outputArea) {
        const responses = {
            'default': 'Comando não reconhecido. Tente <code>gasto</code>, <code>categorias</code>, <code>desafio</code>, <code>rachar</code> ou <code>ajuda</code>.',
            'gasto': (args) => {
                const value = parseFloat(args[1]);
                const description = args.slice(2).join(' ');
                if (!value || isNaN(value)) return 'Formato inválido. Use: <code>gasto 50 almoço</code> ou <code>TV 2500 em 10x</code>.';
                if (args.includes('em') && args.includes('x')) {
                     return `✅ Gasto parcelado de <strong>R$ ${value.toFixed(2)}</strong> (${description}) registrado com sucesso!`;
                }
                return `✅ Gasto de <strong>R$ ${value.toFixed(2)}</strong> (${description || 'Não especificado'}) registrado!`;
            },
            'categorias': '📊 <strong>Relatório do Mês:</strong><br> - 🍔 Alimentação: R$ 450,00 (45%)<br> - 🚗 Transporte: R$ 250,00 (25%)<br> - 🏠 Moradia: R$ 200,00 (20%)<br> - 🎬 Lazer: R$ 100,00 (10%)',
            'parcelas': '💳 <strong>Parcelas Ativas:</strong><br> - Celular Novo: (3/10) R$ 300,00<br> - Tênis: (2/4) R$ 80,00<br>Total pendente: R$ 2640,00',
            'desafio': '🏆 Desafio aceito: "Ficar 7 dias sem gastar com delivery". Vou monitorar seus gastos de Alimentação. Boa sorte!',
            'rachar': (args) => {
                const value = parseFloat(args[1]);
                if (!value) return 'Uso: <code>/rachar [valor] [descrição] @amigo1 @amigo2...</code> em um grupo.';
                return `✅ Conta "pizza" de R$ ${value.toFixed(2)} dividida! Enviei uma mensagem privada para cada participante confirmar o pagamento.`;
            },
            'excluir': '🗑️ Para gerenciar seus dados, use <code>/excluir ultimo</code> para apagar o registro mais recente, ou <code>/excluir tudo</code> para apagar todos os seus dados (requer dupla confirmação).',
            'ajuda': 'Comandos disponíveis: <code>gasto</code>, <code>categorias</code>, <code>parcelas</code>, <code>desafio</code>, <code>rachar</code>, <code>excluir</code>.'
        };

        const handleCommand = () => {
            const value = commandInput.value.trim();
            if (!value) return;

            const userMessage = document.createElement('p');
            userMessage.innerHTML = `<span style="color: var(--color-accent-muted);">></span> ${value}`;
            outputArea.appendChild(userMessage);

            const command = value.split(' ')[0].toLowerCase().replace('/', '');
            const args = value.split(' ');
            
            let botReplyText = responses.default;
            if (responses[command]) {
                botReplyText = typeof responses[command] === 'function' ? responses[command](args) : responses[command];
            }

            setTimeout(() => {
                const botMessage = document.createElement('p');
                botMessage.className = 'bot-message';
                botMessage.innerHTML = botReplyText;
                outputArea.appendChild(botMessage);
                outputArea.scrollTop = outputArea.scrollHeight;
            }, 800);

            commandInput.value = '';
        };

        sendBtn.addEventListener('click', handleCommand);
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand();
            }
        });
    }

    // Efeito Ripple nos botões
    const allButtons = document.querySelectorAll('.btn');
    if (allButtons.length > 0) {
        allButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Previne o ripple nos botões do header para não conflitar com outras interações
                if (this.classList.contains('btn-header-cta')) return;
                
                const ripple = document.createElement("span");
                const rect = this.getBoundingClientRect();
                ripple.className = "ripple";
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
});