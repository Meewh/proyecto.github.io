document.addEventListener('DOMContentLoaded', () => {
  const chatbotBtn = document.getElementById('chatbot-btn');
  const chatbotBox = document.getElementById('chatbot-box');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const inputField = document.querySelector('#chatbot-input input');
  const sendBtn = document.querySelector('#chatbot-input button');

  // Rutas de tus imágenes
 const iconOpen = '<img src="img/MikanOpen.png" alt="Cerrar">';
 const iconClosed = '<img src="img/MikanClosed.png" alt="Abrir chat">';

  // Icono inicial
  chatbotBtn.innerHTML = iconClosed;

  // Abrir/cerrar con clase
  chatbotBtn.addEventListener('click', () => {
    chatbotBox.classList.toggle('open');
    chatbotBtn.innerHTML = chatbotBox.classList.contains('open') ? iconOpen : iconClosed;
  });

  const faqData = [
    { question: "⏰ ¿Cuáles son los horarios de atención?", answer: "Atendemos de lunes a viernes de 9:00 a 18:00 hs." },
    { question: "🚚 ¿Hacen envíos?", answer: "Sí, realizamos envíos a todo el país por correo." },
    { question: "💳 ¿Qué métodos de pago aceptan?", answer: "Aceptamos tarjetas de crédito, débito y transferencias bancarias." },
    { question: "🏬 ¿Tienen PickUp?", answer: "Somos una tienda exclusivamente online, por lo que no contamos con un lugar fisico de retiro" },
    { question: "📦 ¿Cómo puedo rastrear mi pedido?", answer: "Una vez enviado, te proporcionaremos un código de seguimiento por correo." },
    { question: "🔄 ¿Cuál es su política de devoluciones?", answer: "Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en su estado original." },
  ];

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender); 
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  faqData.forEach(item => {
    addMessage(item.question, 'user');
    addMessage(item.answer, 'bot');
  });

  function sendMessage() {
    const text = inputField.value.trim();
    if (text !== "") {
      addMessage(text, 'user');
      inputField.value = "";

      setTimeout(() => {
        addMessage("✅ Gracias por tu mensaje. A la brevedad un operador se pondrá en contacto contigo.", 'bot');
      }, 600);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
