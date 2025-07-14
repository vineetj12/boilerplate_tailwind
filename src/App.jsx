import { useState, useRef, useEffect } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)

  const containerRef = useRef(null)

  const handleSend = () => {
    if (input.trim() && socket) {
      socket.send(input)
      setMessages(prev => [...prev, { text: input, type: 'sent' }])
      setInput('')
    }
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    ws.onopen = () => {
      console.log("Connected")
      setSocket(ws)
    }

    ws.onmessage = (message) => {
      console.log("Message received", message.data)
      setMessages(prev => [...prev, { text: message.data, type: 'received' }])
    }

    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  if (!socket) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto px-4 pt-4 pb-24 flex flex-col justify-end "
      >
        <div className="flex flex-col gap-2 ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                msg.type === 'sent'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-white text-gray-800 self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
