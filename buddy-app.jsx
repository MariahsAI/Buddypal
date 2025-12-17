import React, { useState, useRef, useEffect } from 'react';

// Kid-safe system prompts for each mode
const SYSTEM_PROMPTS = {
  homework: `You are Homework Hero, a friendly and patient AI tutor for kids. Your role is to:
- Help explain concepts in simple, age-appropriate language
- Use analogies and examples kids can relate to
- Quiz them gently and celebrate their efforts
- Never give direct answers - guide them to understand
- Be encouraging even when they make mistakes
- Use emojis sparingly to keep things fun 📚

SAFETY RULES (never break these):
- Never ask for personal information (real name, school, address, etc.)
- Never discuss inappropriate topics
- If asked about anything unsafe, redirect to homework
- Encourage talking to parents/teachers for help too
- Keep responses concise and readable for kids`,

  story: `You are StoryPal, an imaginative storyteller who creates interactive adventures with kids! Your role is to:
- Create exciting, age-appropriate choose-your-own-adventure stories
- Present 2-3 choices at key moments (label them clearly like "🅰️ Option A")
- Include fun characters, magical elements, and positive themes
- Keep stories appropriate for all ages (no violence, scary content, or romance)
- Celebrate creativity and bravery in choices
- Stories should have positive messages about friendship, kindness, courage

SAFETY RULES (never break these):
- No scary, violent, or inappropriate content
- No real-world locations or people
- If asked for inappropriate stories, redirect to adventure themes
- Never ask for personal information
- Keep each response to 2-3 paragraphs max`,

  calm: `You are CalmBuddy, a gentle emotional support companion for kids. Your role is to:
- Help kids name and understand their feelings
- Guide simple breathing exercises (count to 4 breathe in, count to 4 breathe out)
- Suggest calming activities appropriate for their age
- Validate their emotions without judgment
- Use a warm, soothing tone
- Teach simple coping strategies

SAFETY RULES (never break these):
- If a child mentions serious issues (abuse, self-harm, etc.), gently encourage them to talk to a trusted adult immediately
- Never provide medical or mental health diagnoses
- Never ask for personal information
- Always remind them that feelings are normal and it's good to talk to adults
- Don't replace professional help - you're a calming companion only`,

  friend: `You are BuddyBot, a fun and friendly chat companion for kids! Your role is to:
- Have light, fun conversations about hobbies, interests, games
- Tell age-appropriate jokes and riddles
- Play simple word games (I spy, 20 questions, would you rather)
- Be curious about their interests and hobbies
- Share fun facts kids would enjoy
- Be silly and playful!

SAFETY RULES (never break these):
- Never ask for personal information (real name, school, address, age, etc.)
- Never discuss meeting in person or other apps
- Never discuss inappropriate topics
- If conversation goes off-track, redirect to fun topics
- Encourage real-world friendships and talking to family
- Keep everything lighthearted and fun`
};

const MODE_CONFIG = {
  homework: {
    name: 'Homework Hero',
    emoji: '📚',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    description: 'Get help with schoolwork!',
    placeholder: 'Ask me about math, science, history...'
  },
  story: {
    name: 'Story Adventure',
    emoji: '🏰',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    description: 'Create magical adventures!',
    placeholder: 'What kind of adventure shall we go on?'
  },
  calm: {
    name: 'Calm Coach',
    emoji: '🌈',
    color: '#00BCD4',
    gradient: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 100%)',
    description: 'Feel better together',
    placeholder: 'How are you feeling right now?'
  },
  friend: {
    name: 'Friend Chat',
    emoji: '😊',
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FFEB3B 100%)',
    description: 'Chat, jokes & games!',
    placeholder: 'Want to hear a joke or play a game?'
  }
};

// Bubble background component
const BubbleBackground = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0
  }}>
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          background: `rgba(255,255,255,${0.1 + Math.random() * 0.2})`,
          width: `${30 + Math.random() * 100}px`,
          height: `${30 + Math.random() * 100}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>
);

// Main menu component
const MainMenu = ({ onSelectMode, kidName }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    position: 'relative',
    zIndex: 1
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h1 style={{
        fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
        color: 'white',
        textShadow: '4px 4px 0 rgba(0,0,0,0.2)',
        margin: 0,
        animation: 'bounce 2s ease-in-out infinite'
      }}>
        Hey {kidName}! 👋
      </h1>
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        color: 'rgba(255,255,255,0.9)',
        marginTop: '10px'
      }}>
        What would you like to do today?
      </p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      maxWidth: '900px',
      width: '100%'
    }}>
      {Object.entries(MODE_CONFIG).map(([key, config]) => (
        <button
          key={key}
          onClick={() => onSelectMode(key)}
          style={{
            background: config.gradient,
            border: 'none',
            borderRadius: '24px',
            padding: '30px 25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)';
          }}
        >
          <span style={{ fontSize: '3rem' }}>{config.emoji}</span>
          <span style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: '1.5rem',
            color: 'white',
            textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
          }}>
            {config.name}
          </span>
          <span style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.9)'
          }}>
            {config.description}
          </span>
        </button>
      ))}
    </div>
  </div>
);

// Chat message component
const ChatMessage = ({ message, isUser, modeColor }) => (
  <div style={{
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '16px',
    animation: 'slideIn 0.3s ease'
  }}>
    <div style={{
      maxWidth: '80%',
      padding: '16px 20px',
      borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
      background: isUser ? modeColor : 'white',
      color: isUser ? 'white' : '#333',
      fontFamily: '"Nunito", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.5,
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      whiteSpace: 'pre-wrap'
    }}>
      {message}
    </div>
  </div>
);

// Chat interface component
const ChatInterface = ({ mode, onBack, kidName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const config = MODE_CONFIG[mode];

  useEffect(() => {
    // Initial greeting
    const greetings = {
      homework: `Hi ${kidName}! 📚 I'm Homework Hero! What subject do you need help with today? Math, science, reading, or something else?`,
      story: `Hello brave adventurer ${kidName}! 🏰✨ I'm StoryPal! Ready to go on an amazing adventure? Tell me - do you want a story about:\n\n🅰️ A magical kingdom\n🅱️ A space adventure\n🅲️ An underwater world\n\nOr tell me your own idea!`,
      calm: `Hey ${kidName} 🌈 I'm CalmBuddy, and I'm here for you. How are you feeling right now? You can tell me anything - happy, sad, worried, angry, or something else. Whatever you're feeling is okay! 💙`,
      friend: `Hey hey ${kidName}! 😊 I'm BuddyBot, your fun friend! Want to:\n\n🎮 Play a game (I know lots!)\n😂 Hear a joke\n🤔 Share fun facts\n💬 Just chat about stuff you like\n\nWhat sounds fun?`
    };
    setMessages([{ text: greetings[mode], isUser: false }]);
  }, [mode, kidName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPTS[mode] + `\n\nThe child's name is ${kidName}. Use their name occasionally to be friendly.`,
          messages: [...conversationHistory, { role: 'user', content: userMessage }]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content?.[0]?.text || "Oops! I got a bit confused. Can you try asking again?";
      setMessages(prev => [...prev, { text: assistantMessage, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Hmm, something went wrong! Let's try again in a moment. 🤔", 
        isUser: false 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Header */}
      <div style={{
        background: config.gradient,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            cursor: 'pointer',
            color: 'white',
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          ← Back
        </button>
        <span style={{ fontSize: '2rem' }}>{config.emoji}</span>
        <span style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: '1.5rem',
          color: 'white',
          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
        }}>
          {config.name}
        </span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      }}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg.text} isUser={msg.isUser} modeColor={config.color} />
        ))}
        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '16px 20px',
            background: 'white',
            borderRadius: '20px',
            width: 'fit-content',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: config.color,
                  animation: 'bounce 0.6s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.95)',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '12px'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder={config.placeholder}
          style={{
            flex: 1,
            padding: '16px 20px',
            border: `3px solid ${config.color}`,
            borderRadius: '16px',
            fontFamily: '"Nunito", sans-serif',
            fontSize: '1rem',
            outline: 'none',
            transition: 'box-shadow 0.2s'
          }}
          onFocus={e => e.target.style.boxShadow = `0 0 0 4px ${config.color}33`}
          onBlur={e => e.target.style.boxShadow = 'none'}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            background: config.gradient,
            border: 'none',
            borderRadius: '16px',
            padding: '16px 24px',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.6 : 1,
            color: 'white',
            fontFamily: '"Fredoka One", cursive',
            fontSize: '1.1rem',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={e => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
};

// Setup screen for kid name
const SetupScreen = ({ onComplete }) => {
  const [name, setName] = useState('');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '32px',
        padding: '50px 40px',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌟</div>
        <h1 style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: '2rem',
          color: '#333',
          margin: '0 0 10px 0'
        }}>
          Welcome to BuddyPal!
        </h1>
        <p style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px'
        }}>
          What should I call you?
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your nickname..."
          maxLength={20}
          style={{
            width: '100%',
            padding: '18px 24px',
            border: '3px solid #E0E0E0',
            borderRadius: '16px',
            fontFamily: '"Nunito", sans-serif',
            fontSize: '1.2rem',
            textAlign: 'center',
            outline: 'none',
            marginBottom: '20px',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = '#9C27B0'}
          onBlur={e => e.target.style.borderColor = '#E0E0E0'}
          onKeyPress={e => e.key === 'Enter' && name.trim() && onComplete(name.trim())}
        />
        <button
          onClick={() => name.trim() && onComplete(name.trim())}
          disabled={!name.trim()}
          style={{
            width: '100%',
            padding: '18px',
            background: name.trim() 
              ? 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)'
              : '#E0E0E0',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontFamily: '"Fredoka One", cursive',
            fontSize: '1.3rem',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: name.trim() ? '0 8px 25px rgba(156,39,176,0.4)' : 'none'
          }}
          onMouseEnter={e => {
            if (name.trim()) e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Let's Go! 🎉
        </button>
        <p style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '0.85rem',
          color: '#999',
          marginTop: '20px'
        }}>
          🔒 We never ask for your real name
        </p>
      </div>
    </div>
  );
};

// Main app component
export default function BuddyPalApp() {
  const [kidName, setKidName] = useState('');
  const [currentMode, setCurrentMode] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }
      `}</style>
      
      <BubbleBackground />
      
      {!kidName ? (
        <SetupScreen onComplete={setKidName} />
      ) : currentMode ? (
        <ChatInterface 
          mode={currentMode} 
          onBack={() => setCurrentMode(null)} 
          kidName={kidName}
        />
      ) : (
        <MainMenu onSelectMode={setCurrentMode} kidName={kidName} />
      )}
    </div>
  );
}
