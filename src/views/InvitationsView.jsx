import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Inbox, Send } from 'lucide-react'
import useInvitationStore from '../stores/invitationStore'
import InvitationList from '../components/invitations/InvitationList'
import SentInvitationList from '../components/invitations/SentInvitationList'

/**
 * Invitations management view
 */
export default function InvitationsView() {
  const [activeTab, setActiveTab] = useState('received')
  const { fetchPendingCount, pendingCount } = useInvitationStore()

  useEffect(() => {
    fetchPendingCount()
  }, [fetchPendingCount])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Team Invitations</h1>
        <p className="text-sm text-base-content/60">Manage your team invitations</p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1">
        <button
          onClick={() => setActiveTab('received')}
          className={`tab gap-2 flex-1 ${activeTab === 'received' ? 'tab-active' : ''}`}
        >
          <Inbox size={16} />
          Received
          {pendingCount > 0 && (
            <span className="badge badge-warning badge-sm">{pendingCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`tab gap-2 flex-1 ${activeTab === 'sent' ? 'tab-active' : ''}`}
        >
          <Send size={16} />
          Sent
        </button>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'received' && <InvitationList />}
        {activeTab === 'sent' && <SentInvitationList />}
      </motion.div>
    </div>
  )
}
