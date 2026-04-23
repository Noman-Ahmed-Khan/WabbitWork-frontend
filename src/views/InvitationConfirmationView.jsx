import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import config from '../config/env'

/**
 * Confirmation view for accepting/declining team invitations - Brutalist Editorial Design
 * Handles redirect from email links: /invitations/confirmation?status=accepted|declined
 */
export default function InvitationConfirmationView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    const validStatuses = ['accepted', 'declined']
    if (!status || !validStatuses.includes(status)) {
      setDisplayMessage('invalid')
    } else {
      setDisplayMessage(status)
    }
  }, [status])

  const isAccepted = displayMessage === 'accepted'
  const isDeclined = displayMessage === 'declined'
  const isInvalid = displayMessage === 'invalid'

  return (
    <div className="brutalist-grain-bg min-h-screen flex items-center justify-center p-6 font-body text-on-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-headline font-black text-2xl tracking-tighter uppercase text-on-tertiary-fixed">
            {config.app.name}
          </span>
          <span className="block font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant opacity-60">
            Brutalist Edition
          </span>
        </div>

        {/* Card */}
        <div className="brutalist-card p-8 md:p-12">
          {isAccepted && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <span className="material-symbols-outlined text-3xl text-green-700" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                  Invitation Accepted!
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  You have successfully accepted the team invitation. You can now access the team and collaborate with your team members.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/teams')}
                  className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  View Teams
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full border-2 border-black text-black py-4 font-headline font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          )}

          {isDeclined && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
                  <span className="material-symbols-outlined text-3xl text-stone-600">cancel</span>
                </div>
                <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                  Invitation Declined
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  You have declined the team invitation. The team organizer has been notified. You can still accept invitations in your invitations panel.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/invitations')}
                  className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  View Invitations
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full border-2 border-black text-black py-4 font-headline font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          )}

          {isInvalid && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/10 mb-4">
                  <span className="material-symbols-outlined text-3xl text-tertiary">warning</span>
                </div>
                <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                  Invalid Link
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  The invitation link appears to be invalid or expired. Please check your email for the correct link or contact support.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/invitations')}
                  className="w-full border-2 border-black text-black py-4 font-headline font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  View Invitations
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 opacity-40">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
            Need help? Contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
