import React, { useEffect, useState } from 'react'
import { Card, Avatar, Tooltip, Empty, Modal, Button } from 'antd'
import { useMediaQuery } from 'react-responsive'

export default function Highlights() {
  const [highlights, setHighlights] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null) // track index instead of item
  const isMobile = useMediaQuery({ maxWidth: 768 }) // detect mobile

  useEffect(() => {
    // Placeholder: fetch top-rated events from API
    setHighlights([
      { id: 1, title: 'Street Food Pop-up', expiresIn: 30, region: 'Nairobi', cover: '/images/food.jpg' },
      { id: 2, title: 'Open Mic Night', expiresIn: 90, region: 'Nairobi', cover: '/images/music.jpg' }
    ])
  }, [])

  // Countdown + auto-expiry
  useEffect(() => {
    const timer = setInterval(() => {
      setHighlights(prev =>
        prev
          .map(item => ({ ...item, expiresIn: item.expiresIn - 1 }))
          .filter(item => item.expiresIn > 0)
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const openHighlight = (index) => setCurrentIndex(index)
  const closeHighlight = () => setCurrentIndex(null)

  const goPrev = () => setCurrentIndex(i => (i > 0 ? i - 1 : i))
  const goNext = () => setCurrentIndex(i => (i < highlights.length - 1 ? i + 1 : i))

  const selectedHighlight = currentIndex !== null ? highlights[currentIndex] : null

  const highlightBar = (
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '8px 0' }}>
      {highlights.map((item, index) => (
        <Tooltip
          key={item.id}
          title={`${item.title} • expires in ${Math.ceil(item.expiresIn / 60)} min`}
        >
          <div
            style={{ textAlign: 'center', minWidth: 80, cursor: 'pointer' }}
            onClick={() => openHighlight(index)} // click opens modal
          >
            <Avatar
              size={64}
              src={item.cover}
              style={{ border: '3px solid #f5222d' }}
            />
            <div style={{ fontSize: '12px', marginTop: 4 }}>{item.title}</div>
          </div>
        </Tooltip>
      ))}
    </div>
  )

  return (
    <>
      {isMobile ? (
        // WhatsApp-style floating bar
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '8px 0'
          }}
        >
          {highlights.length > 0 ? highlightBar : <Empty description="No highlights yet" />}
        </div>
      ) : (
        // Desktop fallback: inside a Card
        <Card title="🔥 Highlights (Trending Soon)" style={{ marginBottom: 16 }}>
          {highlights.length > 0 ? highlightBar : <Empty description="No highlights yet" />}
        </Card>
      )}

      {/* Modal for highlight details */}
      <Modal
        open={!!selectedHighlight}
        footer={null}
        onCancel={closeHighlight}
        title={selectedHighlight?.title}
      >
        {selectedHighlight && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={selectedHighlight.cover}
              alt={selectedHighlight.title}
              style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
            />
            <p><strong>Region:</strong> {selectedHighlight.region}</p>
            <p><strong>Expires in:</strong> {Math.ceil(selectedHighlight.expiresIn / 60)} min</p>
            <p>✨ More event details can go here...</p>

            {/* Swipe controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <Button onClick={goPrev} disabled={currentIndex === 0}>Prev</Button>
              <Button onClick={goNext} disabled={currentIndex === highlights.length - 1}>Next</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}