(function() {
  'use strict';

  // ── State ──
  var chatOpen = false;
  var messages = [];
  var sessionMessageCount = 0;
  var isTyping = false;
  var leadCaptured = false;

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
/* Hide bubble on mobile when sticky bar exists - we use sticky bar button instead */\
@media(max-width:768px){.sc-bubble.has-mob-cta{display:none}.sc-bubble{bottom:24px}}\
\
/* Chat panel - desktop */\
.sc-panel{position:fixed;bottom:96px;right:24px;width:400px;height:600px;background:#FAFAFA;border-radius:16px;box-shadow:0 12px 60px rgba(0,0,0,.18);z-index:9991;display:none;flex-direction:column;overflow:hidden;transform:translateY(16px) scale(.96);opacity:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .2s}\
.sc-panel.open{display:flex;transform:translateY(0) scale(1);opacity:1}\
\
/* Mobile: full screen */\
@media(max-width:768px){\
.sc-panel{inset:0;width:100%;height:100%;border-radius:0;bottom:0;right:0;top:0;left:0}\
}\
\
/* Header */\
.sc-header{background:#2C3A2C;color:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}\
.sc-header-logo{width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.sc-header-logo svg{width:20px;height:20px}\
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
\
/* Mobile input: stay above keyboard */\
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

  // ── HTML ──
  // Chat bubble (desktop)
  var bubble = document.createElement('button');
  bubble.className = 'sc-bubble';
  bubble.setAttribute('aria-label', 'Chat with us');
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7z"/></svg>';
  document.body.appendChild(bubble);

  // Chat panel
  var panel = document.createElement('div');
  panel.className = 'sc-panel';
  panel.innerHTML = '\
<div class="sc-header">\
<div class="sc-header-logo"><svg viewBox="0 0 24 24" fill="#2C3A2C"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>\
<div class="sc-header-info"><h4>Stellar Upgrades</h4><span>AI Assistant</span></div>\
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

  // ── Mobile sticky bar: replace the quote button ──
  function setupMobileCTA() {
    var mobCta = document.querySelector('.mob-cta');
    if (!mobCta) return;
    // Flag bubble to hide on mobile since sticky bar exists
    bubble.classList.add('has-mob-cta');
    var quoteBtn = mobCta.querySelector('.mob-cta-quote');
    if (!quoteBtn) return;
    // Create new chat button
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

    // Render option buttons for assistant messages
    if (role === 'assistant' && parsed.options.length > 0 && showOptions !== false) {
      renderOptions(parsed.options);
    }

    scrollToBottom();
  }

  function renderOptions(options) {
    // Remove any existing option buttons
    var old = messagesEl.querySelectorAll('.sc-options');
    old.forEach(function(el) { el.remove(); });

    var wrap = document.createElement('div');
    wrap.className = 'sc-options';

    options.forEach(function(optText) {
      var btn = document.createElement('button');
      btn.className = 'sc-opt';
      btn.textContent = optText;
      btn.addEventListener('click', function() {
        // Highlight tapped button, fade out siblings
        btn.classList.add('selected');
        wrap.classList.add('fade-out');
        setTimeout(function() {
          wrap.remove();
          // Send as user message
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
    // Remove all existing bubbles and option buttons (not typing indicator)
    var existing = messagesEl.querySelectorAll('.sc-msg, .sc-options');
    existing.forEach(function(el) { el.remove(); });

    // Find last assistant message index to show options only on it
    var lastAssistantIdx = -1;
    for (var j = messages.length - 1; j >= 0; j--) {
      if (messages[j].role === 'assistant' && typeof messages[j]._displayText === 'string') {
        lastAssistantIdx = j;
        break;
      }
    }

    // Check if last message is from assistant (options still active)
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

  // ── Open / Close ──
  function openChat() {
    chatOpen = true;
    panel.classList.add('open');
    // Force reflow for animation
    panel.offsetHeight;

    // Show opening message if first time
    if (messages.length === 0) {
      var greeting = "Hey! I'm PJ's personal assistant. PJ is the co-founder of Stellar Upgrades \u2014 I can answer any questions about solar, battery backup, EV chargers, pricing, financing, or our process. How can I help you today?";
      messages.push({ role: 'assistant', content: [{ type: 'text', text: greeting }], _displayText: greeting });
      addMessageBubble('assistant', greeting, false);
      renderOptions(['How much does solar cost?', 'Tell me about battery backup', 'EV charger pricing', 'Talk to PJ directly']);
      saveSession();
    } else {
      renderExistingMessages();
    }

    setTimeout(function() { inputEl.focus(); }, 300);

    if (typeof gtag === 'function') {
      gtag('event', 'chat_opened', { event_category: 'engagement' });
    }
  }

  function closeChat() {
    chatOpen = false;
    panel.classList.remove('open');
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

    // Remove any existing option buttons
    var oldOpts = messagesEl.querySelectorAll('.sc-options');
    oldOpts.forEach(function(el) { el.remove(); });

    // Add user message
    messages.push({ role: 'user', content: text });
    addMessageBubble('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sessionMessageCount++;
    saveSession();

    showTyping();
    sendBtn.disabled = true;

    // Build API messages (strip _displayText for API)
    var apiMessages = messages.map(function(m) {
      if (m._displayText !== undefined) {
        return { role: m.role, content: m.content };
      }
      return { role: m.role, content: m.content };
    });

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: apiMessages,
        sessionMessageCount: sessionMessageCount
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

    // Always store assistant message (needed for API context, even if no text)
    messages.push({ role: 'assistant', content: data.content, _displayText: displayText });
    if (displayText) {
      addMessageBubble('assistant', displayText);
    }

    // Handle tool use - capture lead
    if (toolUse && !leadCaptured) {
      leadCaptured = true;
      submitLeadToSunbase(toolUse.input);

      // Send tool result back and get final response
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
          sessionMessageCount: sessionMessageCount
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
      // Fire Google Ads conversion
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

  // ── Expose openChat globally for mobile CTA ──
  window.openStellarChat = openChat;

})();
