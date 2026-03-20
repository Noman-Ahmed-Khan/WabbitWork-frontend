import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Button from '../components/primitives/Button'
import config from '../config/env'

/**
 * Confirmation view for accepting/declining team invitations from email
 * Handles redirect from email links with query parameter: /invitations/confirmation?status=accepted|declined
 */
export default function InvitationConfirmationView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    // Validate status parameter
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
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content font-bold text-2xl mb-3">
            T
          </div>
          <h1 className="text-2xl font-bold mb-1">{config.app.name}</h1>
        </div>

        {/* Card */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 md:p-8">
          {isAccepted && (
            <>
              {/* Success Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </div>

              {/* Title & Message */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Invitation Accepted!</h2>
                <p className="text-base-content/60">
                  You have successfully accepted the team invitation. You can now access the team and collaborate with your team members.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/teams')}
                  className="w-full"
                >
                  View Teams
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}

          {isDeclined && (
            <>
              {/* Decline Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning/20">
                  <XCircle className="w-8 h-8 text-warning" />
                </div>
              </div>

              {/* Title & Message */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Invitation Declined</h2>
                <p className="text-base-content/60">
                  You have declined the team invitation. The team organizer has been notified. You can still accept invitations in your invitations panel.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/invitations')}
                  className="w-full"
                >
                  View Invitations
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}

          {isInvalid && (
            <>
              {/* Error Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-error/20">
                  <AlertCircle className="w-8 h-8 text-error" />
                </div>
              </div>

              {/* Title & Message */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Invalid Link</h2>
                <p className="text-base-content/60">
                  The invitation link appears to be invalid or expired. Please check your email for the correct link or contact support if you need assistance.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Home
                </Button>
                <Button
                  onClick={() => navigate('/invitations')}
                  variant="outline"
                  className="w-full"
                >
                  View Invitations
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-base-content/50">
          <p>Need help? Contact support at support@{config.app.domain}</p>
        </div>
      </div>
    </div>
  )
}
