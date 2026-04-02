// v2.0 — PJ peek card + avatar header
(function() {
  'use strict';

  // ── State ──
  var chatOpen = false;
  var peekOpen = false;
  var peekDismissed = false;
  var messages = [];
  var sessionMessageCount = 0;
  var isTyping = false;
  var leadCaptured = false;

  var isReturnVisitor = false;
  try {
    var firstVisit = localStorage.getItem('stellar_first_visit');
    if (firstVisit) {
      isReturnVisitor = true;
    } else {
      localStorage.setItem('stellar_first_visit', Date.now().toString());
    }
  } catch(e) {}

  var isAfterHours = false;
  try {
    var now = new Date();
    var mstHour = new Date(now.toLocaleString('en-US', {timeZone: 'America/Edmonton'}));
    var hour = mstHour.getHours();
    var day = mstHour.getDay();
    isAfterHours = (hour >= 20 || hour < 8 || day === 0 || day === 6);
  } catch(e) {}

  // Restore session
  try {
    var saved = sessionStorage.getItem('stellar_chat');
    if (saved) {
      var parsed = JSON.parse(saved);
      messages = parsed.messages || [];
      sessionMessageCount = parsed.count || 0;
      leadCaptured = parsed.leadCaptured || false;
    }
  } catch(e) {}

  function saveSession() {
    try {
      sessionStorage.setItem('stellar_chat', JSON.stringify({
        messages: messages,
        count: sessionMessageCount,
        leadCaptured: leadCaptured
      }));
    } catch(e) {}
  }

  // ── CSS ──
  var css = document.createElement('style');
  css.textContent = '\
/* Chat bubble - desktop */\
.sc-bubble{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#2C3A2C;border:none;cursor:pointer;z-index:9990;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:transform .2s,box-shadow .2s}\
.sc-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,.3)}\
.sc-bubble svg{width:28px;height:28px;fill:#fff}\
.sc-bubble.hidden{display:none}\
@media(max-width:768px){.sc-bubble.has-mob-cta{display:none}.sc-bubble{bottom:24px}}\
\
/* ═══ PEEK CARD ═══ */\
.sc-peek{position:fixed;bottom:24px;right:24px;width:340px;background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.15),0 0 0 1px rgba(30,42,30,.06);z-index:9992;overflow:hidden;transform:translateY(20px) scale(.95);opacity:0;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s;pointer-events:none}\
.sc-peek.show{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}\
@media(max-width:768px){.sc-peek{left:12px;right:12px;bottom:80px;width:auto}}\
\
.sc-peek-header{display:flex;align-items:center;gap:12px;padding:18px 20px 14px}\
.sc-peek-avatar{width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #c9a84c}\
.sc-peek-info{flex:1}\
.sc-peek-name{font-family:"Outfit",sans-serif;font-size:15px;font-weight:700;color:#1E2A1E;margin:0;line-height:1.2}\
.sc-peek-role{font-family:"Outfit",sans-serif;font-size:12px;color:#5A6B5A;font-weight:400;margin:0}\
.sc-peek-online{display:inline-block;width:8px;height:8px;background:#6ecf80;border-radius:50%;margin-left:6px;vertical-align:middle}\
.sc-peek-close{background:none;border:none;cursor:pointer;width:32px;height:32px;min-width:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:18px;color:#94A494;transition:background .2s,color .2s;flex-shrink:0}\
.sc-peek-close:hover{background:rgba(30,42,30,.06);color:#1E2A1E}\
\
.sc-peek-greeting{padding:0 20px 14px;font-family:"Outfit",sans-serif;font-size:14px;color:#1E2A1E;line-height:1.5;font-weight:400}\
\
.sc-peek-input-wrap{display:flex;gap:8px;padding:0 16px 16px;align-items:center}\
.sc-peek-input{flex:1;border:1px solid rgba(30,42,30,.12);border-radius:60px;padding:12px 18px;font-family:"Outfit",sans-serif;font-size:14px;color:#1E2A1E;background:#FAFAF8;outline:none;min-height:44px;box-sizing:border-box}\
.sc-peek-input:focus{border-color:rgba(201,168,76,.5);box-shadow:0 0 0 3px rgba(201,168,76,.1)}\
.sc-peek-input::placeholder{color:rgba(30,42,30,.35)}\
.sc-peek-send{width:44px;height:44px;min-width:44px;border-radius:50%;background:#2C3A2C;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .1s;flex-shrink:0}\
.sc-peek-send:hover{background:#3a4d3a}\
.sc-peek-send:active{transform:scale(.94)}\
.sc-peek-send svg{width:18px;height:18px;fill:#fff}\
\
.sc-peek-quick{display:flex;gap:6px;padding:0 16px 14px;flex-wrap:wrap}\
.sc-peek-quick-btn{background:#FAFAF8;border:1px solid rgba(30,42,30,.1);border-radius:60px;padding:8px 14px;font-family:"Outfit",sans-serif;font-size:12px;font-weight:500;color:#2C3A2C;cursor:pointer;transition:all .2s;white-space:nowrap}\
.sc-peek-quick-btn:hover{background:#2C3A2C;color:#fff;border-color:#2C3A2C}\
\
/* ═══ CHAT PANEL ═══ */\
.sc-panel{position:fixed;bottom:96px;right:24px;width:400px;height:600px;background:#FAFAFA;border-radius:16px;box-shadow:0 12px 60px rgba(0,0,0,.18);z-index:9991;display:none;flex-direction:column;overflow:hidden;transform:translateY(16px) scale(.96);opacity:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .2s}\
.sc-panel.open{display:flex;transform:translateY(0) scale(1);opacity:1}\
@media(max-width:768px){\
.sc-panel{inset:0;width:100%;height:100%;border-radius:0;bottom:0;right:0;top:0;left:0}\
}\
\
/* Header */\
.sc-header{background:#2C3A2C;color:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}\
.sc-header-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #c9a84c}\
.sc-header-info{flex:1}\
.sc-header-info h4{font-family:"Outfit",sans-serif;font-size:15px;font-weight:700;margin:0;line-height:1.2}\
.sc-header-info span{font-size:12px;opacity:.7;font-weight:400}\
.sc-close{background:none;border:none;color:#fff;cursor:pointer;width:44px;height:44px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:22px;transition:background .2s;flex-shrink:0}\
.sc-close:hover{background:rgba(255,255,255,.12)}\
\
/* Messages area */\
.sc-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}\
\
/* Message bubbles */\
.sc-msg{max-width:82%;padding:12px 16px;border-radius:18px;font-size:15px;line-height:1.5;font-family:"Outfit",sans-serif;word-wrap:break-word;white-space:pre-wrap}\
.sc-msg a{color:inherit;text-decoration:underline}\
.sc-msg-agent{background:#2C3A2C;color:#fff;align-self:flex-start;border-bottom-left-radius:6px}\
.sc-msg-agent a{color:#c9a84c}\
.sc-msg-user{background:#E8E8E8;color:#1E2A1E;align-self:flex-end;border-bottom-right-radius:6px}\
\
/* Typing indicator */\
.sc-typing{align-self:flex-start;display:none;padding:12px 18px;background:#2C3A2C;border-radius:18px;border-bottom-left-radius:6px;gap:5px;align-items:center}\
.sc-typing.show{display:flex}\
.sc-typing span{width:7px;height:7px;background:rgba(255,255,255,.5);border-radius:50%;animation:sc-dot 1.4s infinite}\
.sc-typing span:nth-child(2){animation-delay:.2s}\
.sc-typing span:nth-child(3){animation-delay:.4s}\
@keyframes sc-dot{0%,60%,100%{opacity:.3;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}\
\
/* Input area */\
.sc-input-area{padding:12px 16px;border-top:1px solid rgba(30,42,30,.08);display:flex;gap:8px;align-items:flex-end;background:#fff;flex-shrink:0}\
.sc-input{flex:1;border:1px solid rgba(30,42,30,.12);border-radius:24px;padding:12px 18px;font-family:"Outfit",sans-serif;font-size:16px;color:#1E2A1E;background:#FAFAFA;outline:none;resize:none;min-height:48px;max-height:120px;line-height:1.4;box-sizing:border-box}\
.sc-input:focus{border-color:rgba(44,58,44,.3)}\
.sc-input::placeholder{color:rgba(30,42,30,.35)}\
.sc-send{width:48px;height:48px;min-width:48px;min-height:48px;border-radius:50%;background:#2C3A2C;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .1s;flex-shrink:0}\
.sc-send:hover{background:#3a4d3a}\
.sc-send:active{transform:scale(.94)}\
.sc-send:disabled{opacity:.4;cursor:default;transform:none}\
.sc-send svg{width:20px;height:20px;fill:#fff}\
@media(max-width:768px){\
.sc-input-area{padding-bottom:env(safe-area-inset-bottom,12px)}\
}\
\
/* Option buttons */\
.sc-options{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start;max-width:82%;margin-top:2px;transition:opacity .3s}\
.sc-options.fade-out{opacity:0;pointer-events:none}\
.sc-opt{background:#fff;color:#2C3A2C;border:1px solid #2C3A2C;border-radius:60px;padding:10px 18px;font-family:"Outfit",sans-serif;font-size:14px;font-weight:500;cursor:pointer;min-height:44px;display:inline-flex;align-items:center;transition:background .2s,color .2s;line-height:1.3}\
.sc-opt:hover{background:#2C3A2C;color:#fff}\
.sc-opt.selected{background:#2C3A2C;color:#fff}\
@media(max-width:360px){.sc-options{flex-direction:column}.sc-opt{justify-content:center}}\
\
/* Powered by */\
.sc-powered{text-align:center;padding:4px;font-size:10px;color:rgba(30,42,30,.3);background:#fff;flex-shrink:0}\
';
  document.head.appendChild(css);

  // ── PJ avatar URL ──
  var PJ_AVATAR = '/images/pj.webp';

  // ── HTML: Chat bubble ──
  var bubble = document.createElement('button');
  bubble.className = 'sc-bubble';
  bubble.setAttribute('aria-label', 'Chat with us');
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7z"/></svg>';
  document.body.appendChild(bubble);

  // ── Page-aware peek greeting ──
  var path = window.location.pathname.toLowerCase();
  var peekGreeting = "Hey! I'm PJ. Have a question about solar, batteries, or EV chargers? I'm here to help.";
  var peekQuickButtons = [
    {label: 'Solar pricing', q: 'How much does solar cost?'},
    {label: 'Battery backup', q: 'Tell me about battery backup'},
    {label: 'EV chargers', q: 'EV charger pricing'}
  ];

  if (isReturnVisitor && messages.length === 0) {
    peekGreeting = "Welcome back! Still thinking about it? I can answer any new questions or connect you with PJ directly.";
  }

  if (path.indexOf('/ev-charger') !== -1) {
    peekGreeting = "Hey! Thinking about a home EV charger? I can walk you through pricing, installation, and 0% financing.";
    peekQuickButtons = [
      {label: '40A pricing', q: 'How much is the 40A Wallbox charger installed?'},
      {label: '48A pricing', q: 'How much is the 48A Wallbox charger installed?'},
      {label: '0% financing', q: 'Tell me about 0% financing for EV chargers'}
    ];
  } else if (path.indexOf('/battery') !== -1) {
    peekGreeting = "Hey! Looking at battery backup? I can show you EP Cube pricing and what it covers during an outage.";
    peekQuickButtons = [
      {label: 'EP Cube pricing', q: 'How much does the EP Cube battery cost?'},
      {label: 'What it powers', q: 'What can the EP Cube run during an outage?'},
      {label: 'Solar + battery', q: 'Can I add battery to a solar system?'}
    ];
  } else if (path.indexOf('/neighbour') !== -1) {
    peekGreeting = "Hey! Looks like you got one of our door hangers. What's your monthly electricity bill? I'll show you the real numbers.";
    peekQuickButtons = [
      {label: 'My bill is ~$200/mo', q: 'My electricity bill is about $200 per month, what would solar cost?'},
      {label: 'My bill is ~$300/mo', q: 'My electricity bill is about $300 per month, what would solar cost?'},
      {label: 'Just browsing', q: 'I just want to learn about solar first'}
    ];
  } else if (path.indexOf('/welcome') !== -1) {
    peekGreeting = "Hey! Excited for your upcoming assessment. Have any questions before PJ visits?";
    peekQuickButtons = [
      {label: 'What to expect', q: 'What happens during the assessment?'},
      {label: 'Financing options', q: 'What financing options do you offer?'},
      {label: 'How long does install take?', q: 'How long does a solar installation take?'}
    ];
  } else if (path.indexOf('/contact') !== -1) {
    peekGreeting = "Hey! Want to get in touch? I can answer most questions right here, or connect you with PJ directly.";
    peekQuickButtons = [
      {label: 'Get a quote', q: 'I want a quote for solar on my home'},
      {label: 'Call PJ', q: 'I want to talk to PJ directly'},
      {label: 'Existing customer', q: 'I am an existing customer and need help'}
    ];
  } else if (path.indexOf('/financing') !== -1 || path.indexOf('/finance') !== -1) {
    peekGreeting = "Hey! Looking at financing options? I can walk you through $0-down, CEIP, and cash discount options.";
    peekQuickButtons = [
      {label: '$0 down financing', q: 'Tell me about $0 down financing for solar'},
      {label: 'CEIP property tax', q: 'How does CEIP property tax financing work?'},
      {label: 'Cash discount', q: 'What discount do I get if I pay cash?'}
    ];
  } else if (path.indexOf('/blog') !== -1) {
    peekGreeting = "Hey! Doing your research? Smart. I can answer specific questions about solar in Alberta if you want.";
    peekQuickButtons = [
      {label: 'Solar cost in Alberta', q: 'How much does solar cost in Alberta?'},
      {label: 'Winter performance', q: 'How well does solar work in Alberta winters?'},
      {label: 'Get a quote', q: 'I want a quote for solar on my home'}
    ];
  } else if (path.indexOf('/about') !== -1) {
    peekGreeting = "Hey! Want to know more about our team? Ask me anything about Stellar Upgrades.";
    peekQuickButtons = [
      {label: 'How many installs?', q: 'How many installs has Stellar Upgrades done?'},
      {label: 'Who does the work?', q: 'Who actually installs the solar panels?'},
      {label: 'Get a quote', q: 'I want a quote for solar on my home'}
    ];
  } else if (path.indexOf('/careers') !== -1) {
    peekGreeting = "Hey! Interested in joining the team? I can tell you about open positions.";
    peekQuickButtons = [
      {label: 'Open positions', q: 'What positions are you hiring for?'},
      {label: 'D2D sales', q: 'Tell me about the door to door sales role'},
      {label: 'How to apply', q: 'How do I apply?'}
    ];
  } else if (path.indexOf('/solar') !== -1 && path.indexOf('/areas/') === -1) {
    peekGreeting = "Hey! Thinking about solar? Tell me your monthly electricity bill and I'll show you the real numbers.";
    peekQuickButtons = [
      {label: 'My bill is ~$200/mo', q: 'My electricity bill is about $200 per month, what would solar cost?'},
      {label: 'My bill is ~$300/mo', q: 'My electricity bill is about $300 per month, what would solar cost?'},
      {label: 'How it works', q: 'How does solar work with net metering in Alberta?'}
    ];
  }

  var cityPageMatch = path.match(/\/areas\/([\w-]+)/);
  if (cityPageMatch) {
    var cityDisplay = cityPageMatch[1].replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    peekGreeting = "Hey! Looking at solar in " + cityDisplay + "? We've done installs all across " + cityDisplay + " and area. What's your monthly electricity bill?";
    peekQuickButtons = [
      {label: 'My bill is ~$200/mo', q: 'My electricity bill is about $200 per month. I live in ' + cityDisplay + ', what would solar cost?'},
      {label: 'My bill is ~$300/mo', q: 'My electricity bill is about $300 per month. I live in ' + cityDisplay + ', what would solar cost?'},
      {label: 'Do you serve ' + cityDisplay + '?', q: 'Do you guys serve ' + cityDisplay + '?'}
    ];
  }

  if (isAfterHours) {
    peekGreeting += " (PJ's offline right now, but I can still help and set up a callback.)";
  }

  var quickBtnsHtml = peekQuickButtons.map(function(b) {
    return '<button class="sc-peek-quick-btn" data-q="' + b.q + '">' + b.label + '</button>';
  }).join('');

  // ── HTML: Peek card ──
  var peek = document.createElement('div');
  peek.className = 'sc-peek';
  peek.innerHTML = '\
<div class="sc-peek-header">\
<img class="sc-peek-avatar" src="' + PJ_AVATAR + '" alt="PJ Singh">\
<div class="sc-peek-info"><p class="sc-peek-name">PJ Singh <span class="sc-peek-online"></span></p><p class="sc-peek-role">Co-Founder · Stellar Upgrades</p></div>\
<button class="sc-peek-close" aria-label="Close">&times;</button>\
</div>\
<div class="sc-peek-greeting">' + peekGreeting + '</div>\
<div class="sc-peek-input-wrap">\
<input class="sc-peek-input" id="scPeekInput" placeholder="Ask me anything..." type="text">\
<button class="sc-peek-send" id="scPeekSend" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>\
</div>\
<div class="sc-peek-quick">' + quickBtnsHtml + '</div>\
';
  document.body.appendChild(peek);

  var peekInput = document.getElementById('scPeekInput');
  var peekSendBtn = document.getElementById('scPeekSend');
  var peekCloseBtn = peek.querySelector('.sc-peek-close');
  var peekQuickBtns = peek.querySelectorAll('.sc-peek-quick-btn');

  // ── HTML: Chat panel ──
  var panel = document.createElement('div');
  panel.className = 'sc-panel';
  panel.innerHTML = '\
<div class="sc-header">\
<img class="sc-header-avatar" src="' + PJ_AVATAR + '" alt="PJ Singh">\
<div class="sc-header-info"><h4>PJ Singh</h4><span>Co-Founder · Stellar Upgrades</span></div>\
<button class="sc-close" aria-label="Close chat">&times;</button>\
</div>\
<div class="sc-messages" id="scMessages">\
<div class="sc-typing" id="scTyping"><span></span><span></span><span></span></div>\
</div>\
<div class="sc-input-area">\
<textarea class="sc-input" id="scInput" placeholder="Type a message..." rows="1"></textarea>\
<button class="sc-send" id="scSend" aria-label="Send message"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>\
</div>\
<div class="sc-powered">Powered by AI</div>\
';
  document.body.appendChild(panel);

  var messagesEl = document.getElementById('scMessages');
  var typingEl = document.getElementById('scTyping');
  var inputEl = document.getElementById('scInput');
  var sendBtn = document.getElementById('scSend');
  var closeBtn = panel.querySelector('.sc-close');

  // ── Mobile sticky bar ──
  function setupMobileCTA() {
    var mobCta = document.querySelector('.mob-cta');
    if (!mobCta) return;
    bubble.classList.add('has-mob-cta');

    var path = window.location.pathname.toLowerCase();
    var waText;
    if (path === '/' || path.indexOf('/index') !== -1 || path.indexOf('/solar') !== -1) {
      waText = "Hi, I'm interested in solar for my home";
    } else if (path.indexOf('/ev-charger') !== -1) {
      waText = "Hi, I'm interested in an EV charger for my home";
    } else if (path.indexOf('/battery') !== -1) {
      waText = "Hi, I'm interested in battery backup for my home";
    } else {
      waText = "Hi, I'm interested in learning about solar, battery, or EV charging for my home";
    }
    var waUrl = 'https://wa.me/17802005265?text=' + encodeURIComponent(waText);

    var callBtn = mobCta.querySelector('.mob-cta-call') || mobCta.querySelector('.mob-cta-c');
    if (callBtn) {
      var waBtn = document.createElement('a');
      waBtn.href = waUrl;
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
      waBtn.textContent = 'WhatsApp Us';
      waBtn.style.cssText = 'flex:1;text-align:center;padding:14px 8px;border-radius:60px;font-weight:700;font-size:16px;font-family:inherit;background:transparent;color:#25D366;border:2px solid #25D366;text-decoration:none;cursor:pointer';
      callBtn.replaceWith(waBtn);
    }

    var quoteBtn = mobCta.querySelector('.mob-cta-quote') || mobCta.querySelector('.mob-cta-q');
    if (quoteBtn) {
      var chatBtn = document.createElement('button');
      chatBtn.className = 'mob-cta-quote';
      chatBtn.textContent = 'Chat With Us';
      chatBtn.style.cssText = 'flex:1;text-align:center;padding:14px 8px;border-radius:60px;font-weight:700;font-size:16px;font-family:inherit;background:#1E2A1E;color:#fff;border:2px solid transparent;cursor:pointer';
      chatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openChat();
      });
      quoteBtn.replaceWith(chatBtn);
    }
  }
  setupMobileCTA();

  // ── Helpers ──
  function linkify(text) {
    return text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function parseOptions(text) {
    var options = [];
    var cleanText = text.replace(/\[\[([^\]]+)\]\]/g, function(_, opt) {
      options.push(opt.trim());
      return '';
    }).replace(/\n+$/, '').trim();
    return { text: cleanText, options: options };
  }

  function addMessageBubble(role, text, showOptions) {
    var parsed = (role === 'assistant') ? parseOptions(text) : { text: text, options: [] };
    var div = document.createElement('div');
    div.className = 'sc-msg ' + (role === 'assistant' ? 'sc-msg-agent' : 'sc-msg-user');
    div.innerHTML = linkify(parsed.text);
    messagesEl.insertBefore(div, typingEl);
    if (role === 'assistant' && parsed.options.length > 0 && showOptions !== false) {
      renderOptions(parsed.options);
    }
    scrollToBottom();
  }

  function renderOptions(options) {
    var old = messagesEl.querySelectorAll('.sc-options');
    old.forEach(function(el) { el.remove(); });
    var wrap = document.createElement('div');
    wrap.className = 'sc-options';
    options.forEach(function(optText) {
      var btn = document.createElement('button');
      btn.className = 'sc-opt';
      btn.textContent = optText;
      btn.addEventListener('click', function() {
        btn.classList.add('selected');
        wrap.classList.add('fade-out');
        setTimeout(function() {
          wrap.remove();
          inputEl.value = optText;
          sendMessage();
        }, 250);
      });
      wrap.appendChild(btn);
    });
    messagesEl.insertBefore(wrap, typingEl);
    scrollToBottom();
  }

  function scrollToBottom() {
    requestAnimationFrame(function() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  function showTyping() {
    isTyping = true;
    typingEl.classList.add('show');
    scrollToBottom();
  }

  function hideTyping() {
    isTyping = false;
    typingEl.classList.remove('show');
  }

  function renderExistingMessages() {
    var existing = messagesEl.querySelectorAll('.sc-msg, .sc-options');
    existing.forEach(function(el) { el.remove(); });
    var lastAssistantIdx = -1;
    for (var j = messages.length - 1; j >= 0; j--) {
      if (messages[j].role === 'assistant' && typeof messages[j]._displayText === 'string') {
        lastAssistantIdx = j;
        break;
      }
    }
    var lastMsgIsAssistant = messages.length > 0 && messages[messages.length - 1].role === 'assistant';
    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i];
      if (msg.role === 'assistant' && typeof msg._displayText === 'string') {
        var showOpts = (i === lastAssistantIdx && lastMsgIsAssistant);
        addMessageBubble('assistant', msg._displayText, showOpts);
      } else if (msg.role === 'user') {
        var text = typeof msg.content === 'string' ? msg.content : '';
        if (Array.isArray(msg.content)) {
          text = msg.content.filter(function(b) { return b.type === 'text'; }).map(function(b) { return b.text; }).join('');
        }
        if (text) addMessageBubble('user', text);
      }
    }
  }

  // ── Peek: show / hide ──
  function showPeek() {
    if (chatOpen || peekOpen) return;
    peekOpen = true;
    bubble.classList.add('hidden');
    peek.classList.add('show');
    if (typeof gtag === 'function') {
      gtag('event', 'chat_peek_shown', { event_category: 'engagement' });
    }
  }

  function hidePeek() {
    peekOpen = false;
    peek.classList.remove('show');
    if (!chatOpen) {
      bubble.classList.remove('hidden');
    }
  }

  function dismissPeek() {
    peekDismissed = true;
    hidePeek();
    saveSession();
  }

  // Auto-show peek after 4 seconds on every page load
  setTimeout(function() {
    if (!chatOpen && !peekDismissed) {
      showPeek();
    }
  }, 4000);

  // Exit intent — show peek when mouse leaves viewport
  if (window.innerWidth > 768) {
    var exitShown = false;
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY < 10 && !exitShown && !chatOpen && !peekOpen && !peekDismissed) {
        exitShown = true;
        showPeek();
      }
    });
  }

  // Scroll depth — show peek at 60% scroll if not yet shown
  var scrollShown = false;
  window.addEventListener('scroll', function() {
    if (scrollShown || chatOpen || peekOpen || peekDismissed) return;
    var scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (scrollPct > 60) {
      scrollShown = true;
      showPeek();
    }
  });

  // Peek close button
  peekCloseBtn.addEventListener('click', function() {
    dismissPeek();
  });

  // Peek input: send from peek → open full chat with that message
  function sendFromPeek(text) {
    if (!text) return;
    peekDismissed = true;
    hidePeek();
    openChat(text);
  }

  peekSendBtn.addEventListener('click', function() {
    sendFromPeek(peekInput.value.trim());
  });

  peekInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendFromPeek(peekInput.value.trim());
    }
  });

  // Peek quick buttons
  peekQuickBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      sendFromPeek(btn.getAttribute('data-q'));
    });
  });

  // ── Open / Close chat ──
  function openChat(initialMessage) {
    chatOpen = true;
    peekDismissed = true;
    hidePeek();
    bubble.classList.add('hidden');
    panel.classList.add('open');
    panel.offsetHeight; // force reflow

    if (messages.length === 0) {
      var greeting = "Hey! I'm PJ's personal assistant. PJ is the co-founder of Stellar Upgrades \u2014 I can answer any questions about solar, battery backup, EV chargers, pricing, financing, or our process. How can I help you today?";
      messages.push({ role: 'assistant', content: [{ type: 'text', text: greeting }], _displayText: greeting });
      addMessageBubble('assistant', greeting, false);

      if (initialMessage) {
        // User typed something in peek — send it immediately
        setTimeout(function() {
          inputEl.value = initialMessage;
          sendMessage();
        }, 300);
      } else {
        renderOptions(['How much does solar cost?', 'Tell me about battery backup', 'EV charger pricing', 'Talk to PJ directly']);
      }
      saveSession();
    } else {
      renderExistingMessages();
      if (initialMessage) {
        setTimeout(function() {
          inputEl.value = initialMessage;
          sendMessage();
        }, 300);
      }
    }

    setTimeout(function() { inputEl.focus(); }, 300);

    if (typeof gtag === 'function') {
      gtag('event', 'chat_opened', { event_category: 'engagement' });
    }
  }

  function closeChat() {
    chatOpen = false;
    panel.classList.remove('open');
    bubble.classList.remove('hidden');
  }

  bubble.addEventListener('click', function() {
    if (chatOpen) closeChat(); else openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  // ── Auto-resize textarea ──
  inputEl.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // ── Send message ──
  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isTyping) return;

    var oldOpts = messagesEl.querySelectorAll('.sc-options');
    oldOpts.forEach(function(el) { el.remove(); });

    messages.push({ role: 'user', content: text });
    addMessageBubble('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sessionMessageCount++;
    saveSession();

    showTyping();
    sendBtn.disabled = true;

    var apiMessages = messages.map(function(m) {
      return { role: m.role, content: m.content };
    });

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: apiMessages,
        sessionMessageCount: sessionMessageCount,
        currentPage: window.location.pathname,
        referrer: document.referrer
      })
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) { throw new Error(err.error || 'Something went wrong'); });
      }
      return res.json();
    })
    .then(function(data) {
      handleResponse(data);
    })
    .catch(function(err) {
      hideTyping();
      sendBtn.disabled = false;
      addMessageBubble('assistant', "Sorry, I'm having trouble connecting right now. You can call us directly at (780) 200-5265 and we'll be happy to help!");
    });
  }

  function handleResponse(data) {
    hideTyping();
    sendBtn.disabled = false;

    if (!data || !data.content) return;

    var textParts = [];
    var toolUse = null;

    for (var i = 0; i < data.content.length; i++) {
      var block = data.content[i];
      if (block.type === 'text' && block.text) {
        textParts.push(block.text);
      }
      if (block.type === 'tool_use' && block.name === 'capture_lead') {
        toolUse = block;
      }
    }

    var displayText = textParts.join('\n');
    messages.push({ role: 'assistant', content: data.content, _displayText: displayText });
    if (displayText) {
      addMessageBubble('assistant', displayText);
    }

    if (toolUse && !leadCaptured) {
      leadCaptured = true;
      submitLeadToSunbase(toolUse.input);

      messages.push({
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: 'Lead captured successfully. The team will follow up within 24 hours.'
        }]
      });
      saveSession();

      showTyping();
      sendBtn.disabled = true;

      var apiMessages = messages.map(function(m) {
        return { role: m.role, content: m.content };
      });

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          sessionMessageCount: sessionMessageCount,
          currentPage: window.location.pathname,
          referrer: document.referrer
        })
      })
      .then(function(res) { return res.json(); })
      .then(function(data2) { handleResponse(data2); })
      .catch(function() {
        hideTyping();
        sendBtn.disabled = false;
      });
    }

    saveSession();
    scrollToBottom();
  }

  // ── SunBase lead submission ──
  function submitLeadToSunbase(lead) {
    var params = new URLSearchParams({
      schema_name: 'stellarupgrades',
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      phone: lead.phone || '',
      lead_source: 'AI Chat',
      salesRep: 'f51909f89cb8465ab31ace5ebf26f4c8',
      apptcomments: (lead.conversation_summary || '') +
        (lead.interest ? ' | Interest: ' + lead.interest : '') +
        (lead.monthly_bill ? ' | Monthly bill: $' + lead.monthly_bill : '')
    });
    if (lead.email) params.set('email', lead.email);
    if (lead.monthly_bill) params.set('customField37', lead.monthly_bill.replace(/[^0-9.]/g, ''));

    var img = new Image();
    img.onload = img.onerror = function() {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          send_to: 'AW-385606008/2VjbCMSd3_8bEPmVz_tC',
          value: 1,
          currency: 'CAD'
        });
        gtag('event', 'generate_lead', {
          event_category: 'ai_chat',
          event_label: 'chat_lead_capture'
        });
      }
    };
    img.src = 'https://server4.sunbasedata.com/sunbase/portal/api/lead_post.jsp?' + params.toString();
  }

  // ── Input handlers ──
  sendBtn.addEventListener('click', sendMessage);

  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ── Expose openChat globally ──
  window.openStellarChat = openChat;

})();
