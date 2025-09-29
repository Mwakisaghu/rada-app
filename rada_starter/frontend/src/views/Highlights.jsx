import React, { useEffect, useState, useRef } from 'react'
import { Avatar, Tooltip, Empty, Modal, Button, Progress } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { useSwipeable } from 'react-swipeable'

export default function Highlights() {
  const [highlights, setHighlights] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null)
  const [progress, setProgress] = useState(0) // progress % for autoplay
  const autoplayDuration = 5000 // 5 seconds per highlight
  const intervalRef = useRef(null)
  const isMobile = useMediaQuery({ maxWidth: 768 })

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

  const openHighlight = (index) => {
    setCurrentIndex(index)
    setProgress(0) // reset progress
  }

  const closeHighlight = () => {
    setCurrentIndex(null)
    setProgress(0)
    clearInterval(intervalRef.current)
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setProgress(0)
    }
  }

  const goNext = () => {
    if (currentIndex < highlights.length - 1) {
      setCurrentIndex(i => i + 1)
      setProgress(0)
    } else {
      closeHighlight()
    }
  }

  const selectedHighlight = currentIndex !== null ? highlights[currentIndex] : null

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goPrev(),
    trackMouse: true,
  })

  // Auto-play effect
  useEffect(() => {
    if (selectedHighlight) {
      clearInterval(intervalRef.current)
      let startTime = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const percent = Math.min((elapsed / autoplayDuration) * 100, 100)
        setProgress(percent)
        if (percent >= 100) {
          goNext()
        }
      }, 100)
    }
    return () => clearInterval(intervalRef.current)
  }, [selectedHighlight, currentIndex])

  const highlightBar = (
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '8px 0' }}>
      {highlights.map((item, index) => (
        <Tooltip
          key={item.id}
          title={`${item.title} • expires in ${Math.ceil(item.expiresIn / 60)} min`}
        >
          <div
            style={{ textAlign: 'center', minWidth: 80, cursor: 'pointer' }}
            onClick={() => openHighlight(index)}
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
        <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
          {highlights.length > 0 ? highlightBar : <Empty description="No highlights yet" />}
        </div>
      )}

      {/* Modal for highlight details */}
      <Modal
        open={!!selectedHighlight}
        footer={null}
        onCancel={closeHighlight}
        title={selectedHighlight?.title}
      >
        {selectedHighlight && (
          <div {...swipeHandlers} style={{ textAlign: 'center' }}>
            {/* Progress bar at top */}
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor="#f5222d"
              style={{ marginBottom: 16 }}
            />

            <img
              src={selectedHighlight.cover}
              alt={selectedHighlight.title}
              style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
            />
            <p><strong>Region:</strong> {selectedHighlight.region}</p>
            <p><strong>Expires in:</strong> {Math.ceil(selectedHighlight.expiresIn / 60)} min</p>
            <p>✨ More event details can go here...</p>

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