import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const score = searchParams.get('score') || '100';
    const duration = searchParams.get('duration') || '45';
    const day = searchParams.get('day') || 'Workout';
    const streak = searchParams.get('streak') || '0';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0A',
            backgroundImage: 'linear-gradient(to bottom right, #0A0A0A, #1a0f0a)',
            fontFamily: '"Inter", sans-serif',
            padding: '40px',
          }}
        >
          {/* Decorative Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              background: 'rgba(255, 69, 0, 0.15)',
              filter: 'blur(100px)',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              backgroundColor: '#FF4500',
              borderRadius: '60px',
              marginBottom: '30px',
              boxShadow: '0 0 60px rgba(255, 69, 0, 0.4)',
            }}
          >
            <span style={{ fontSize: '60px' }}>🔥</span>
          </div>

          <h1
            style={{
              fontSize: '80px',
              fontWeight: 900,
              color: 'white',
              margin: '0 0 20px 0',
              letterSpacing: '-2px',
              textAlign: 'center',
            }}
          >
            {day} Complete
          </h1>

          <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '30px 40px',
                borderRadius: '24px',
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: '60px', fontWeight: 900, color: '#10B981' }}>{score}%</span>
              <span style={{ fontSize: '24px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>Score</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '30px 40px',
                borderRadius: '24px',
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: '60px', fontWeight: 900, color: 'white' }}>{duration}m</span>
              <span style={{ fontSize: '24px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>Time</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '30px 40px',
                borderRadius: '24px',
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: '60px', fontWeight: 900, color: '#F59E0B' }}>{streak}</span>
              <span style={{ fontSize: '24px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>Streak</span>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#FF4500', letterSpacing: '4px' }}>FITNESS OS</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
