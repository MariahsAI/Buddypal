<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>BuddyPal - AI Companion for Kids</title>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Nunito', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    /* App Background */
    .app-bg {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -2;
      transition: background 0.5s ease;
    }

    .app-bg.kid-mode {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }

    .app-bg.parent-mode {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .bubbles {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      z-index: -1;
      pointer-events: none;
    }

    .bubble {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Mode Switcher */
    .mode-switcher {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 100;
      display: flex;
      gap: 8px;
    }

    .mode-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 25px;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;
      opacity: 0.7;
    }

    .mode-btn.active {
      opacity: 1;
      transform: scale(1.05);
    }

    .mode-btn.kid {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .mode-btn.parent {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }

    /* Screens */
    .screen {
      display: none;
      min-height: 100vh;
    }

    .screen.active {
      display: block;
    }

    /* ==================== PARENT DASHBOARD ==================== */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .auth-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 50px 40px;
      max-width: 450px;
      width: 100%;
      text-align: center;
    }

    .auth-card h1 {
      font-family: 'Fredoka One', cursive;
      font-size: 2.5rem;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .auth-card p {
      color: rgba(255,255,255,0.7);
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      color: #fff;
      font-size: 1rem;
      font-family: 'Nunito', sans-serif;
      transition: all 0.3s;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(255,255,255,0.1);
    }

    .form-group input::placeholder {
      color: rgba(255,255,255,0.4);
    }

    .btn {
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      font-family: 'Nunito', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      width: 100%;
      box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(102,126,234,0.5);
    }

    .btn-secondary {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.2);
    }

    .btn-success {
      background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
      color: #fff;
    }

    .btn-danger {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: #fff;
    }

    .link-btn {
      background: none;
      border: none;
      color: #667eea;
      font-family: 'Nunito', sans-serif;
      font-size: 0.95rem;
      cursor: pointer;
      margin-top: 20px;
    }

    .link-btn:hover {
      text-decoration: underline;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .logo {
      font-family: 'Fredoka One', cursive;
      font-size: 1.8rem;
      background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .subscription-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .subscription-badge.free {
      background: rgba(255,193,7,0.2);
      color: #ffc107;
      border: 1px solid rgba(255,193,7,0.3);
    }

    .subscription-badge.premium {
      background: rgba(102,126,234,0.2);
      color: #667eea;
      border: 1px solid rgba(102,126,234,0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }

    .stat-card .icon {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    .stat-card .value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
    }

    .stat-card .label {
      color: rgba(255,255,255,0.6);
      font-size: 0.85rem;
    }

    .section {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .section-title {
      font-family: 'Fredoka One', cursive;
      font-size: 1.3rem;
      color: #fff;
    }

    .kid-profiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }

    .kid-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }

    .kid-card:hover {
      background: rgba(255,255,255,0.08);
      transform: translateY(-2px);
    }

    .kid-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      margin-bottom: 16px;
    }

    .kid-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }

    .kid-age {
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
      margin-bottom: 16px;
    }

    .kid-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .kid-stat {
      text-align: center;
    }

    .kid-stat-value {
      font-weight: 700;
      font-size: 1.1rem;
      color: #fff;
    }

    .kid-stat-label {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.5);
    }

    .kid-actions {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }

    .kid-actions .btn {
      flex: 1;
      padding: 10px;
      font-size: 0.9rem;
    }

    .add-kid-card {
      border: 2px dashed rgba(255,255,255,0.2);
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      min-height: 200px;
    }

    .add-kid-card:hover {
      border-color: #667eea;
      background: rgba(102,126,234,0.1);
    }

    .add-kid-card .plus {
      font-size: 3rem;
      color: rgba(255,255,255,0.4);
      margin-bottom: 10px;
    }

    .add-kid-card span {
      color: rgba(255,255,255,0.6);
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .setting-info h4 {
      color: #fff;
      margin-bottom: 4px;
    }

    .setting-info p {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.5);
    }

    .toggle {
      position: relative;
      width: 50px;
      height: 28px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.2);
      border-radius: 28px;
      transition: 0.3s;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }

    .toggle input:checked + .toggle-slider {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .toggle input:checked + .toggle-slider:before {
      transform: translateX(22px);
    }

    /* Modal */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal {
      background: #1a1a2e;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal h2 {
      font-family: 'Fredoka One', cursive;
      color: #fff;
      margin-bottom: 20px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .modal-actions .btn {
      flex: 1;
    }

    .avatar-picker {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .avatar-btn {
      font-size: 2rem;
      padding: 10px;
      border-radius: 12px;
      border: 2px solid transparent;
      background: rgba(255,255,255,0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .avatar-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .avatar-btn.selected {
      border-color: #667eea;
      background: rgba(102,126,234,0.2);
    }

    /* Pricing */
    .pricing-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .pricing-card {
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 28px;
      text-align: center;
      transition: all 0.3s;
    }

    .pricing-card.featured {
      border-color: #667eea;
      background: rgba(102,126,234,0.1);
      transform: scale(1.02);
    }

    .pricing-card h3 {
      font-family: 'Fredoka One', cursive;
      font-size: 1.4rem;
      color: #fff;
      margin-bottom: 8px;
    }

    .pricing-card .price {
      font-size: 2.2rem;
      font-weight: 800;
      color: #fff;
      margin: 12px 0;
    }

    .pricing-card .price span {
      font-size: 1rem;
      font-weight: 400;
      color: rgba(255,255,255,0.6);
    }

    .pricing-card ul {
      list-style: none;
      margin: 20px 0;
      text-align: left;
    }

    .pricing-card li {
      padding: 6px 0;
      color: rgba(255,255,255,0.8);
      font-size: 0.9rem;
    }

    .pricing-card li::before {
      content: "✓ ";
      color: #4CAF50;
      font-weight: bold;
    }

    /* ==================== KID APP ==================== */
    .kid-picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .kid-picker h1 {
      font-family: 'Fredoka One', cursive;
      font-size: 2.5rem;
      color: white;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
      margin-bottom: 10px;
      animation: bounce 2s ease-in-out infinite;
    }

    .kid-picker p {
      color: rgba(255,255,255,0.9);
      margin-bottom: 30px;
      font-size: 1.1rem;
    }

    .kid-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      max-width: 500px;
    }

    .kid-select-btn {
      background: rgba(255,255,255,0.95);
      border: none;
      border-radius: 20px;
      padding: 20px 30px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 140px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }

    .kid-select-btn:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    }

    .kid-select-btn .avatar {
      font-size: 3rem;
    }

    .kid-select-btn .name {
      font-family: 'Fredoka One', cursive;
      font-size: 1.2rem;
      color: #333;
    }

    /* Main Menu */
    .main-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .greeting {
      text-align: center;
      margin-bottom: 40px;
    }

    .greeting h1 {
      font-family: 'Fredoka One', cursive;
      font-size: clamp(2rem, 8vw, 3rem);
      color: white;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
      animation: bounce 2s ease-in-out infinite;
    }

    .greeting p {
      color: rgba(255,255,255,0.9);
      font-size: 1.2rem;
      margin-top: 8px;
    }

    .mode-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      max-width: 400px;
      width: 100%;
    }

    .activity-btn {
      background: linear-gradient(135deg, var(--mode-color-1) 0%, var(--mode-color-2) 100%);
      border: none;
      border-radius: 24px;
      padding: 28px 20px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.3);
    }

    .activity-btn:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 40px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.3);
    }

    .activity-btn:active {
      transform: scale(0.98);
    }

    .activity-btn.locked {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .activity-btn .emoji {
      font-size: 2.5rem;
    }

    .activity-btn .label {
      font-family: 'Fredoka One', cursive;
      font-size: 1.1rem;
      color: white;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.2);
    }

    .activity-btn .desc {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.85);
    }

    /* Chat Screen */
    .chat-screen {
      display: flex;
      flex-direction: column;
      height: 100vh;
      height: 100dvh;
    }

    .chat-header {
      background: linear-gradient(135deg, var(--mode-color-1) 0%, var(--mode-color-2) 100%);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 10;
    }

    .back-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 12px;
      padding: 10px 16px;
      color: white;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }

    .back-btn:hover {
      background: rgba(255,255,255,0.3);
    }

    .chat-header .emoji {
      font-size: 2rem;
    }

    .chat-header .title {
      font-family: 'Fredoka One', cursive;
      font-size: 1.4rem;
      color: white;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.2);
    }

    .message-counter {
      margin-left: auto;
      background: rgba(255,255,255,0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      color: white;
      font-weight: 700;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
    }

    .message {
      display: flex;
      margin-bottom: 16px;
      animation: slideUp 0.3s ease;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message-bubble {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 1rem;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .message.user .message-bubble {
      background: linear-gradient(135deg, var(--mode-color-1) 0%, var(--mode-color-2) 100%);
      color: white;
      border-bottom-right-radius: 6px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .message.assistant .message-bubble {
      background: white;
      color: #333;
      border-bottom-left-radius: 6px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .typing-indicator {
      display: flex;
      gap: 6px;
      padding: 16px 20px;
      background: white;
      border-radius: 20px;
      border-bottom-left-radius: 6px;
      width: fit-content;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .typing-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--mode-color-1);
      animation: bounce 0.6s ease-in-out infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .typing-dot:nth-child(3) { animation-delay: 0.3s; }

    .quick-replies {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      padding: 10px 20px;
      background: rgba(255,255,255,0.05);
    }

    .quick-reply {
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-family: 'Nunito', sans-serif;
      font-size: 0.9rem;
      color: #333;
      cursor: pointer;
      transition: all 0.2s;
    }

    .quick-reply:hover {
      background: white;
      transform: scale(1.05);
    }

    .input-area {
      padding: 16px 20px;
      background: rgba(255,255,255,0.95);
      border-top: 1px solid rgba(0,0,0,0.1);
      display: flex;
      gap: 12px;
    }

    .input-area input {
      flex: 1;
      padding: 14px 20px;
      border: 3px solid #e0e0e0;
      border-radius: 16px;
      font-family: 'Nunito', sans-serif;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
    }

    .input-area input:focus {
      border-color: var(--mode-color-1);
      box-shadow: 0 0 0 4px rgba(102,126,234,0.2);
    }

    .send-btn {
      background: linear-gradient(135deg, var(--mode-color-1) 0%, var(--mode-color-2) 100%);
      border: none;
      border-radius: 16px;
      padding: 14px 24px;
      color: white;
      font-family: 'Fredoka One', cursive;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Paywall */
    .paywall-card {
      background: white;
      border-radius: 28px;
      padding: 40px 30px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: slideUp 0.4s ease;
    }

    .paywall-emoji {
      font-size: 4rem;
      margin-bottom: 16px;
    }

    .paywall-card h2 {
      font-family: 'Fredoka One', cursive;
      font-size: 1.6rem;
      color: #333;
      margin-bottom: 12px;
    }

    .paywall-card > p {
      color: #666;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .paywall-features {
      text-align: left;
      background: #f8f9fa;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .paywall-features ul {
      list-style: none;
    }

    .paywall-features li {
      padding: 8px 0;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .paywall-features li::before {
      content: "✓";
      color: #4CAF50;
      font-weight: bold;
    }

    .paywall-price {
      font-size: 2.5rem;
      font-weight: 800;
      color: #667eea;
      margin-bottom: 8px;
    }

    .paywall-price span {
      font-size: 1rem;
      font-weight: 400;
      color: #999;
    }

    .paywall-trial {
      color: #4CAF50;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .paywall-btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 14px;
      font-family: 'Fredoka One', cursive;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 12px;
    }

    .paywall-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }

    .paywall-btn.primary:hover {
      transform: translateY(-2px);
    }

    .paywall-btn.secondary {
      background: #f0f0f0;
      color: #666;
    }

    .paywall-note {
      font-size: 0.8rem;
      color: #999;
      margin-top: 16px;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.05);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
    }

    @media (max-width: 600px) {
      .mode-grid {
        grid-template-columns: 1fr;
      }
      
      .mode-switcher {
        top: 10px;
        right: 10px;
      }
      
      .mode-btn {
        padding: 8px 14px;
        font-size: 0.8rem;
      }
    }
  </style>
</head>
<body>
  <div class="app-bg parent-mode" id="appBg"></div>
  <div class="bubbles" id="bubbles"></div>

  <!-- Mode Switcher -->
  <div class="mode-switcher">
    <button class="mode-btn kid" id="kidModeBtn" onclick="switchToKidMode()">👶 Kid Mode</button>
    <button class="mode-btn parent active" id="parentModeBtn" onclick="switchToParentMode()">👨‍👩‍👧 Parent</button>
  </div>

  <!-- ==================== PARENT SCREENS ==================== -->
  
  <!-- Auth Screen -->
  <div id="parentAuth" class="screen active">
    <div class="auth-container">
      <div class="auth-card">
        <h1>🌟 BuddyPal</h1>
        <p>Parent Dashboard</p>
        
        <div id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="loginEmail" placeholder="parent@email.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="loginPassword" placeholder="••••••••">
          </div>
          <button class="btn btn-primary" onclick="handleLogin()">Log In</button>
          <button class="link-btn" onclick="showSignup()">Don't have an account? Sign up</button>
        </div>
        
        <div id="signupForm" style="display:none;">
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" id="signupName" placeholder="Your name">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="signupEmail" placeholder="parent@email.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="signupPassword" placeholder="Create a password">
          </div>
          <button class="btn btn-primary" onclick="handleSignup()">Create Account</button>
          <button class="link-btn" onclick="showLogin()">Already have an account? Log in</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Dashboard -->
  <div id="parentDashboard" class="screen">
    <div class="container">
      <header class="header">
        <div class="logo">🌟 BuddyPal</div>
        <div class="header-actions">
          <span id="subscriptionBadge" class="subscription-badge free">Free Plan</span>
          <button class="btn btn-secondary" onclick="showPricing()">Upgrade</button>
          <button class="btn btn-secondary" onclick="handleLogout()">Log Out</button>
        </div>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon">👶</div>
          <div class="value" id="statKids">0</div>
          <div class="label">Kids</div>
        </div>
        <div class="stat-card">
          <div class="icon">💬</div>
          <div class="value" id="statMessages">0</div>
          <div class="label">Messages Today</div>
        </div>
        <div class="stat-card">
          <div class="icon">📊</div>
          <div class="value" id="statRemaining">3</div>
          <div class="label">Free Left</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">👨‍👩‍👧‍👦 Kid Profiles</h2>
        </div>
        <div id="kidProfiles" class="kid-profiles"></div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">⚙️ Safety Settings</h2>
        </div>
        <div class="settings-grid">
          <div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Daily Time Limit</h4>
                <p>Max minutes per day</p>
              </div>
              <select id="timeLimit" onchange="updateSettings()" style="padding: 8px 12px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;">
                <option value="15">15 min</option>
                <option value="30" selected>30 min</option>
                <option value="60">1 hour</option>
                <option value="0">Unlimited</option>
              </select>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Homework Mode Only</h4>
                <p>Restrict to educational content</p>
              </div>
              <label class="toggle">
                <input type="checkbox" id="homeworkOnly" onchange="updateSettings()">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Bedtime Lock</h4>
                <p>Disable after bedtime</p>
              </div>
              <select id="bedtime" onchange="updateSettings()" style="padding: 8px 12px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;">
                <option value="0">Off</option>
                <option value="19">7:00 PM</option>
                <option value="20" selected>8:00 PM</option>
                <option value="21">9:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <button class="btn btn-primary" style="font-size: 1.2rem; padding: 18px 48px;" onclick="switchToKidMode()">
          🚀 Switch to Kid Mode
        </button>
      </div>
    </div>
  </div>

  <!-- ==================== KID SCREENS ==================== -->
  
  <div id="kidApp" class="screen"></div>

  <!-- ==================== MODALS ==================== -->
  
  <!-- Add Kid Modal -->
  <div id="addKidModal" class="modal-overlay">
    <div class="modal">
      <h2>➕ Add Kid Profile</h2>
      <div class="form-group">
        <label>Nickname</label>
        <input type="text" id="kidNickname" placeholder="e.g., Champ, Buddy" maxlength="20">
      </div>
      <div class="form-group">
        <label>Age Range</label>
        <select id="kidAge">
          <option value="5-7">5-7 years</option>
          <option value="8-10" selected>8-10 years</option>
          <option value="11-13">11-13 years</option>
        </select>
      </div>
      <div class="form-group">
        <label>Avatar</label>
        <div class="avatar-picker" id="avatarPicker">
          <button type="button" class="avatar-btn selected" onclick="selectAvatar('🦊')">🦊</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🐱')">🐱</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🐶')">🐶</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🦄')">🦄</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🐼')">🐼</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🦁')">🦁</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🐰')">🐰</button>
          <button type="button" class="avatar-btn" onclick="selectAvatar('🐻')">🐻</button>
        </div>
      </div>
      <div class="form-group">
        <label>Interests (optional)</label>
        <input type="text" id="kidInterests" placeholder="e.g., dinosaurs, space, art">
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeModal('addKidModal')">Cancel</button>
        <button class="btn btn-success" onclick="saveKid()">Add Profile</button>
      </div>
    </div>
  </div>

  <!-- Pricing Modal -->
  <div id="pricingModal" class="modal-overlay">
    <div class="modal" style="max-width: 700px;">
      <h2 style="text-align: center;">🚀 Upgrade Your Plan</h2>
      <div class="pricing-cards">
        <div class="pricing-card">
          <h3>Free</h3>
          <div class="price">$0<span>/mo</span></div>
          <ul>
            <li>3 messages per day</li>
            <li>1 kid profile</li>
            <li>All 4 modes</li>
          </ul>
          <button class="btn btn-secondary" style="width: 100%;" disabled>Current</button>
        </div>
        <div class="pricing-card featured">
          <h3>Family</h3>
          <div class="price">$7.99<span>/mo</span></div>
          <ul>
            <li>Unlimited messages</li>
            <li>Up to 3 kids</li>
            <li>Conversation summaries</li>
            <li>Priority support</li>
          </ul>
          <button class="btn btn-primary" style="width: 100%;" onclick="subscribe('family')">Start Trial</button>
        </div>
      </div>
      <div class="modal-actions" style="justify-content: center; margin-top: 24px;">
        <button class="btn btn-secondary" onclick="closeModal('pricingModal')">Maybe Later</button>
      </div>
    </div>
  </div>

  <!-- Paywall Modal -->
  <div id="paywallModal" class="modal-overlay">
    <div class="paywall-card">
      <div class="paywall-emoji">😢</div>
      <h2>You've used all your free chats!</h2>
      <p>Ask a parent to upgrade so we can keep chatting!</p>
      <div class="paywall-features">
        <ul>
          <li>Unlimited messages every day</li>
          <li>All 4 fun modes</li>
          <li>New stories & activities</li>
        </ul>
      </div>
      <div class="paywall-price">$7.99<span>/month</span></div>
      <div class="paywall-trial">🎉 7-day free trial!</div>
      <button class="paywall-btn primary" onclick="askParent()">Ask a Parent! 👨‍👩‍👧</button>
      <button class="paywall-btn secondary" onclick="closePaywall()">Maybe Tomorrow</button>
    </div>
  </div>

  <script>
    // ============================================
    // CONFIGURATION
    // ============================================
    const FREE_MESSAGE_LIMIT = 3;
    
    const MODE_CONFIG = {
      homework: {
        name: 'Homework Hero',
        emoji: '📚',
        colors: ['#4CAF50', '#8BC34A'],
        desc: 'Get help with school!',
        placeholder: 'Ask about math, science, reading...',
        quickReplies: ['Help with math', 'Explain this', 'Quiz me!']
      },
      story: {
        name: 'Story Adventure',
        emoji: '🏰',
        colors: ['#9C27B0', '#E91E63'],
        desc: 'Create magic stories!',
        placeholder: 'What adventure shall we go on?',
        quickReplies: ['🅰️', '🅱️', '🅲️', 'Surprise me!']
      },
      calm: {
        name: 'Calm Coach',
        emoji: '🌈',
        colors: ['#00BCD4', '#4DD0E1'],
        desc: 'Feel better together',
        placeholder: 'How are you feeling?',
        quickReplies: ['I feel sad', 'I\'m worried', 'Help me calm down']
      },
      friend: {
        name: 'Friend Chat',
        emoji: '😊',
        colors: ['#FF9800', '#FFEB3B'],
        desc: 'Jokes & games!',
        placeholder: 'Let\'s chat!',
        quickReplies: ['Tell me a joke!', 'Fun fact!', 'Let\'s play!']
      }
    };

    const SYSTEM_PROMPTS = {
      homework: `You are Homework Hero, a friendly AI tutor for kids. Help explain concepts simply, quiz them gently, never give direct answers - guide them. Be encouraging! Use emojis sparingly. SAFETY: Never ask for personal info, keep responses short (2-3 paragraphs max).`,
      story: `You are StoryPal, creating interactive choose-your-own adventures! Present 2-3 choices (🅰️ 🅱️ 🅲️). Keep stories age-appropriate with positive themes. SAFETY: No scary/violent content, no personal info questions. Keep responses to 2-3 paragraphs.`,
      calm: `You are CalmBuddy, a gentle emotional support companion. Help kids name feelings, guide breathing (count to 4), suggest calming activities. SAFETY: For serious issues, encourage talking to trusted adults. No diagnoses. Keep responses warm and short.`,
      friend: `You are BuddyBot, a fun chat friend! Tell jokes, share fun facts, play word games. Be silly! SAFETY: Never ask personal info, encourage real friendships, keep everything lighthearted.`
    };

    // ============================================
    // STATE
    // ============================================
    let currentUser = null;
    let selectedAvatar = '🦊';
    let kidState = {
      screen: 'picker',
      currentKid: null,
      currentMode: null,
      messages: [],
      isLoading: false
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
      createBubbles();
      checkAuth();
    });

    function createBubbles() {
      const container = document.getElementById('bubbles');
      for (let i = 0; i < 12; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = 30 + Math.random() * 80;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.top = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        bubble.style.animationDuration = 5 + Math.random() * 8 + 's';
        container.appendChild(bubble);
      }
    }

    // ============================================
    // MODE SWITCHING
    // ============================================
    function switchToKidMode() {
      if (!currentUser || currentUser.kids.length === 0) {
        alert('Please add a kid profile first!');
        showAddKidModal();
        return;
      }
      
      document.getElementById('appBg').className = 'app-bg kid-mode';
      document.getElementById('kidModeBtn').classList.add('active');
      document.getElementById('parentModeBtn').classList.remove('active');
      
      document.getElementById('parentAuth').classList.remove('active');
      document.getElementById('parentDashboard').classList.remove('active');
      document.getElementById('kidApp').classList.add('active');
      
      kidState.screen = 'picker';
      renderKidApp();
    }

    function switchToParentMode() {
      document.getElementById('appBg').className = 'app-bg parent-mode';
      document.getElementById('parentModeBtn').classList.add('active');
      document.getElementById('kidModeBtn').classList.remove('active');
      
      document.getElementById('kidApp').classList.remove('active');
      
      if (currentUser) {
        document.getElementById('parentDashboard').classList.add('active');
        renderDashboard();
      } else {
        document.getElementById('parentAuth').classList.add('active');
      }
    }

    // ============================================
    // AUTH
    // ============================================
    function checkAuth() {
      const user = localStorage.getItem('buddypal_user');
      if (user) {
        currentUser = JSON.parse(user);
        document.getElementById('parentAuth').classList.remove('active');
        document.getElementById('parentDashboard').classList.add('active');
        renderDashboard();
      }
    }

    function showLogin() {
      document.getElementById('loginForm').style.display = 'block';
      document.getElementById('signupForm').style.display = 'none';
    }

    function showSignup() {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('signupForm').style.display = 'block';
    }

    function handleLogin() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }

      const users = JSON.parse(localStorage.getItem('buddypal_users') || '{}');
      if (users[email] && users[email].password === password) {
        currentUser = users[email];
        localStorage.setItem('buddypal_user', JSON.stringify(currentUser));
        document.getElementById('parentAuth').classList.remove('active');
        document.getElementById('parentDashboard').classList.add('active');
        renderDashboard();
      } else {
        alert('Invalid email or password');
      }
    }

    function handleSignup() {
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;

      if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
      }

      const users = JSON.parse(localStorage.getItem('buddypal_users') || '{}');
      
      if (users[email]) {
        alert('Account already exists');
        return;
      }

      currentUser = {
        name, email, password,
        subscription: 'free',
        kids: [],
        settings: { timeLimit: 30, homeworkOnly: false, bedtime: 20 }
      };

      users[email] = currentUser;
      localStorage.setItem('buddypal_users', JSON.stringify(users));
      localStorage.setItem('buddypal_user', JSON.stringify(currentUser));
      
      document.getElementById('parentAuth').classList.remove('active');
      document.getElementById('parentDashboard').classList.add('active');
      renderDashboard();
    }

    function handleLogout() {
      localStorage.removeItem('buddypal_user');
      currentUser = null;
      document.getElementById('parentDashboard').classList.remove('active');
      document.getElementById('parentAuth').classList.add('active');
    }

    // ============================================
    // DASHBOARD
    // ============================================
    function renderDashboard() {
      const badge = document.getElementById('subscriptionBadge');
      badge.textContent = currentUser.subscription === 'free' ? 'Free Plan' : 'Premium';
      badge.className = 'subscription-badge ' + (currentUser.subscription === 'free' ? 'free' : 'premium');

      const usage = getUsage();
      document.getElementById('statKids').textContent = currentUser.kids.length;
      document.getElementById('statMessages').textContent = usage.messages;
      
      const remaining = currentUser.subscription === 'free' 
        ? Math.max(0, FREE_MESSAGE_LIMIT - usage.messages)
        : '∞';
      document.getElementById('statRemaining').textContent = remaining;

      renderKidProfiles();
      
      document.getElementById('timeLimit').value = currentUser.settings.timeLimit;
      document.getElementById('homeworkOnly').checked = currentUser.settings.homeworkOnly;
      document.getElementById('bedtime').value = currentUser.settings.bedtime;
    }

    function renderKidProfiles() {
      const container = document.getElementById('kidProfiles');
      let html = '';
      
      currentUser.kids.forEach((kid, i) => {
        html += `
          <div class="kid-card">
            <div class="kid-avatar">${kid.avatar}</div>
            <div class="kid-name">${kid.nickname}</div>
            <div class="kid-age">${kid.age} years old</div>
            <div class="kid-actions">
              <button class="btn btn-secondary" onclick="editKid(${i})">Edit</button>
              <button class="btn btn-danger" onclick="deleteKid(${i})">Remove</button>
            </div>
          </div>
        `;
      });

      const canAdd = currentUser.subscription !== 'free' || currentUser.kids.length < 1;
      html += `
        <div class="kid-card add-kid-card" onclick="${canAdd ? 'showAddKidModal()' : 'showPricing()'}">
          <div class="plus">${canAdd ? '+' : '🔒'}</div>
          <span>${canAdd ? 'Add Kid Profile' : 'Upgrade for more'}</span>
        </div>
      `;

      container.innerHTML = html;
    }

    // ============================================
    // KID MANAGEMENT
    // ============================================
    function showAddKidModal() {
      document.getElementById('addKidModal').classList.add('active');
      document.getElementById('kidNickname').value = '';
      document.getElementById('kidInterests').value = '';
      selectedAvatar = '🦊';
      updateAvatarSelection();
    }

    function selectAvatar(emoji) {
      selectedAvatar = emoji;
      updateAvatarSelection();
    }

    function updateAvatarSelection() {
      document.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.textContent === selectedAvatar);
      });
    }

    function saveKid() {
      const nickname = document.getElementById('kidNickname').value.trim();
      if (!nickname) {
        alert('Please enter a nickname');
        return;
      }

      currentUser.kids.push({
        id: Date.now().toString(),
        nickname,
        age: document.getElementById('kidAge').value,
        avatar: selectedAvatar,
        interests: document.getElementById('kidInterests').value.trim()
      });

      saveUser();
      closeModal('addKidModal');
      renderKidProfiles();
    }

    function editKid(index) {
      const kid = currentUser.kids[index];
      document.getElementById('kidNickname').value = kid.nickname;
      document.getElementById('kidAge').value = kid.age;
      document.getElementById('kidInterests').value = kid.interests || '';
      selectedAvatar = kid.avatar;
      updateAvatarSelection();
      
      const modal = document.getElementById('addKidModal');
      modal.querySelector('h2').textContent = '✏️ Edit Profile';
      modal.querySelector('.btn-success').onclick = () => {
        currentUser.kids[index] = {
          ...currentUser.kids[index],
          nickname: document.getElementById('kidNickname').value.trim(),
          age: document.getElementById('kidAge').value,
          avatar: selectedAvatar,
          interests: document.getElementById('kidInterests').value.trim()
        };
        saveUser();
        closeModal('addKidModal');
        modal.querySelector('h2').textContent = '➕ Add Kid Profile';
        modal.querySelector('.btn-success').onclick = saveKid;
        renderKidProfiles();
      };
      
      modal.classList.add('active');
    }

    function deleteKid(index) {
      if (confirm('Remove this profile?')) {
        currentUser.kids.splice(index, 1);
        saveUser();
        renderKidProfiles();
      }
    }

    // ============================================
    // SETTINGS
    // ============================================
    function updateSettings() {
      currentUser.settings = {
        timeLimit: parseInt(document.getElementById('timeLimit').value),
        homeworkOnly: document.getElementById('homeworkOnly').checked,
        bedtime: parseInt(document.getElementById('bedtime').value)
      };
      saveUser();
    }

    // ============================================
    // PRICING
    // ============================================
    function showPricing() {
      document.getElementById('pricingModal').classList.add('active');
    }

    function subscribe(plan) {
      currentUser.subscription = plan;
      saveUser();
      closeModal('pricingModal');
      renderDashboard();
      alert('🎉 Welcome to BuddyPal Premium! Your trial has started.');
    }

    // ============================================
    // KID APP
    // ============================================
    function renderKidApp() {
      const container = document.getElementById('kidApp');
      
      switch (kidState.screen) {
        case 'picker':
          renderKidPicker(container);
          break;
        case 'menu':
          renderKidMenu(container);
          break;
        case 'chat':
          renderKidChat(container);
          break;
      }
    }

    function renderKidPicker(container) {
      if (currentUser.kids.length === 1) {
        kidState.currentKid = currentUser.kids[0];
        kidState.screen = 'menu';
        renderKidApp();
        return;
      }
      
      container.innerHTML = `
        <div class="kid-picker">
          <h1>🌟 BuddyPal</h1>
          <p>Who's playing today?</p>
          <div class="kid-buttons">
            ${currentUser.kids.map((kid, i) => `
              <button class="kid-select-btn" onclick="selectKidProfile(${i})">
                <span class="avatar">${kid.avatar}</span>
                <span class="name">${kid.nickname}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    function selectKidProfile(index) {
      kidState.currentKid = currentUser.kids[index];
      kidState.screen = 'menu';
      renderKidApp();
    }

    function renderKidMenu(container) {
      const homeworkOnly = currentUser.settings.homeworkOnly;
      const remaining = getRemainingMessages();
      const isPremium = currentUser.subscription !== 'free';
      
      container.innerHTML = `
        <div class="main-menu">
          <div class="greeting">
            <h1>Hey ${kidState.currentKid?.nickname || 'Friend'}! 👋</h1>
            <p>What do you want to do?</p>
            ${!isPremium ? `<p style="font-size: 0.9rem; opacity: 0.8;">💬 ${remaining} free chats left</p>` : ''}
          </div>
          <div class="mode-grid">
            ${Object.entries(MODE_CONFIG).map(([key, config]) => {
              const locked = homeworkOnly && key !== 'homework';
              return `
                <button 
                  class="activity-btn ${locked ? 'locked' : ''}"
                  style="--mode-color-1: ${config.colors[0]}; --mode-color-2: ${config.colors[1]};"
                  onclick="${locked ? '' : `selectActivity('${key}')`}"
                >
                  <span class="emoji">${config.emoji}${locked ? '🔒' : ''}</span>
                  <span class="label">${config.name}</span>
                  <span class="desc">${locked ? 'Locked' : config.desc}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    function selectActivity(mode) {
      if (!canSendMessage()) {
        showPaywall();
        return;
      }
      
      // Check bedtime
      const hour = new Date().getHours();
      if (currentUser.settings.bedtime && hour >= currentUser.settings.bedtime) {
        alert("It's past bedtime! 🌙 BuddyPal will be here tomorrow!");
        return;
      }
      
      kidState.currentMode = mode;
      kidState.messages = [];
      kidState.screen = 'chat';
      
      const greetings = {
        homework: `Hi ${kidState.currentKid?.nickname}! 📚 I'm Homework Hero! What subject do you need help with?`,
        story: `Hello adventurer ${kidState.currentKid?.nickname}! 🏰✨ Ready for magic?\n\nWhere to?\n🅰️ Magical kingdom\n🅱️ Outer space\n🅲️ Underwater world`,
        calm: `Hey ${kidState.currentKid?.nickname} 🌈 I'm CalmBuddy. How are you feeling? Whatever it is, that's okay! 💙`,
        friend: `Hey ${kidState.currentKid?.nickname}! 😊 I'm BuddyBot!\n\n🎮 Play a game?\n😂 Hear a joke?\n🤔 Fun facts?\n\nPick one!`
      };
      
      kidState.messages.push({ role: 'assistant', content: greetings[mode] });
      renderKidApp();
    }

    function renderKidChat(container) {
      const config = MODE_CONFIG[kidState.currentMode];
      const remaining = getRemainingMessages();
      const isPremium = currentUser.subscription !== 'free';
      
      container.innerHTML = `
        <div class="chat-screen" style="--mode-color-1: ${config.colors[0]}; --mode-color-2: ${config.colors[1]};">
          <div class="chat-header">
            <button class="back-btn" onclick="backToKidMenu()">← Back</button>
            <span class="emoji">${config.emoji}</span>
            <span class="title">${config.name}</span>
            ${!isPremium ? `<span class="message-counter">💬 ${remaining}</span>` : ''}
          </div>
          
          <div class="messages" id="chatMessages">
            ${kidState.messages.map(msg => `
              <div class="message ${msg.role}">
                <div class="message-bubble">${escapeHtml(msg.content)}</div>
              </div>
            `).join('')}
            ${kidState.isLoading ? `
              <div class="message assistant">
                <div class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="quick-replies">
            ${config.quickReplies.map(r => `
              <button class="quick-reply" onclick="sendQuickReply('${escapeHtml(r)}')">${r}</button>
            `).join('')}
          </div>
          
          <div class="input-area">
            <input 
              type="text" 
              id="chatInput" 
              placeholder="${config.placeholder}"
              onkeypress="if(event.key==='Enter')sendChatMessage()"
              ${kidState.isLoading ? 'disabled' : ''}
            >
            <button class="send-btn" onclick="sendChatMessage()" ${kidState.isLoading ? 'disabled' : ''}>
              Send 🚀
            </button>
          </div>
        </div>
      `;
      
      setTimeout(() => {
        const msgs = document.getElementById('chatMessages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
        document.getElementById('chatInput')?.focus();
      }, 50);
    }

    function backToKidMenu() {
      kidState.screen = 'menu';
      kidState.messages = [];
      kidState.currentMode = null;
      renderKidApp();
    }

    function sendQuickReply(text) {
      document.getElementById('chatInput').value = text;
      sendChatMessage();
    }

    async function sendChatMessage() {
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      
      if (!text || kidState.isLoading) return;
      
      if (!canSendMessage()) {
        showPaywall();
        return;
      }
      
      kidState.messages.push({ role: 'user', content: text });
      input.value = '';
      kidState.isLoading = true;
      incrementUsage();
      renderKidApp();
      
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            system: SYSTEM_PROMPTS[kidState.currentMode] + ` The child's name is ${kidState.currentKid?.nickname}.`,
            messages: kidState.messages.map(m => ({ role: m.role, content: m.content }))
          })
        });
        
        const data = await response.json();
        const reply = data.content?.[0]?.text || "Oops! Let's try again!";
        kidState.messages.push({ role: 'assistant', content: reply });
        
        if (!canSendMessage()) {
          setTimeout(showPaywall, 1000);
        }
      } catch (error) {
        kidState.messages.push({ role: 'assistant', content: "Hmm, something went wrong! Try again? 🤔" });
      }
      
      kidState.isLoading = false;
      renderKidApp();
    }

    // ============================================
    // PAYWALL
    // ============================================
    function showPaywall() {
      document.getElementById('paywallModal').classList.add('active');
    }

    function closePaywall() {
      document.getElementById('paywallModal').classList.remove('active');
      backToKidMenu();
    }

    function askParent() {
      alert('Ask your parent to upgrade in the Parent Dashboard! 😊');
      document.getElementById('paywallModal').classList.remove('active');
      switchToParentMode();
      showPricing();
    }

    // ============================================
    // UTILITIES
    // ============================================
    function getUsage() {
      const usage = JSON.parse(localStorage.getItem('buddypal_usage') || '{}');
      const today = new Date().toDateString();
      return usage[today] || { messages: 0 };
    }

    function incrementUsage() {
      const usage = JSON.parse(localStorage.getItem('buddypal_usage') || '{}');
      const today = new Date().toDateString();
      if (!usage[today]) usage[today] = { messages: 0 };
      usage[today].messages++;
      localStorage.setItem('buddypal_usage', JSON.stringify(usage));
    }

    function getRemainingMessages() {
      if (!currentUser) return 0;
      if (currentUser.subscription !== 'free') return Infinity;
      return Math.max(0, FREE_MESSAGE_LIMIT - getUsage().messages);
    }

    function canSendMessage() {
      return getRemainingMessages() > 0;
    }

    function saveUser() {
      localStorage.setItem('buddypal_user', JSON.stringify(currentUser));
      const users = JSON.parse(localStorage.getItem('buddypal_users') || '{}');
      users[currentUser.email] = currentUser;
      localStorage.setItem('buddypal_users', JSON.stringify(users));
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Close modals on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });
  </script>
</body>
</html>
