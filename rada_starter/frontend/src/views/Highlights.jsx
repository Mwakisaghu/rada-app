import React, { useEffect, useState, useRef } from 'react'
import { Avatar, Tooltip, Empty, Modal, Button, Progress } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { useSwipeable } from 'react-swipeable'
import crowdEventsImage from '../assets/crowd-events.jpg'

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
      {
        id: 1,
        title: 'Street Food Pop-up',
        expiresIn: 30,
        region: 'Nairobi',
        cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&h=400'
      },
      {
        id: 2,
        title: 'Open Mic Night',
        expiresIn: 90,
        region: 'Nairobi',
        cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=400'
      },
      {
        id: 3,
        title: 'Art Exhibition',
        expiresIn: 120,
        region: 'Nairobi',
        cover: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=400&h=400'
      },
      {
        id: 4,
        title: 'Tech Meetup',
        expiresIn: 60,
        region: 'Nairobi',
        cover: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=400&h=400'
      }
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
          {highlights.length > 0 ? highlightBar : (
            <div
              style={{
                position: 'relative',
                height: '200px',
                borderRadius: '10px',
                overflow: 'hidden',
                margin: '12px'
              }}
            >
              {/* Background image */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${crowdEventsImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.7)'
                }}
              />
              {/* Glassmorphic overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  width: '90%',
                  maxWidth: '400px',
                  textAlign: 'center',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  Discover Exciting Events
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.4' }}>
                  Connect and Create Unforgettable Moments
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
          {/* Desktop/laptop: always show glassmorphic promotional banner */}
          <div
            style={{
              position: 'relative',
              height: '300px',
              borderRadius: '15px',
              overflow: 'hidden',
              margin: '20px'
            }}
          >
            {/* Background image */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${crowdEventsImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)'
              }}
            />
            {/* Glassmorphic overlay */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '2rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                width: '80%',
                maxWidth: '600px',
                textAlign: 'center',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Discover Exciting Events
              </h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
                Connect and Create Unforgettable Moments
              </p>
            </div>
          </div>
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