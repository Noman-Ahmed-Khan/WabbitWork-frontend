import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useInvitationStore from '../stores/invitationStore'
import InvitationList from '../components/invitations/InvitationList'
import SentInvitationList from '../components/invitations/SentInvitationList'

/**
 * Invitations View - Brutalist Editorial Design
 * Bento grid of invitation cards with received/sent tabs
 */
export default function InvitationsView() {
  const [activeTab, setActiveTab] = useState('received')
  const { fetchPendingCount, pendingCount } = useInvitationStore()

  useEffect(() => {
    fetchPendingCount()
  }, [fetchPendingCount])

  return (
    <section className="flex-1 p-12 bg-surface relative overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-2 block">
              Network & Access
            </span>
            <h2 className="text-5xl font-headline font-black tracking-tighter text-on-surface uppercase leading-none">
              Invitations
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-12 relative border-b-2 border-outline-variant/30">
            <button
              onClick={() => setActiveTab('received')}
              className="pb-4 font-headline text-sm font-black tracking-widest uppercase relative group"
            >
              Received
              {pendingCount > 0 && (
                <span className="ml-2 text-tertiary text-xs">{pendingCount}</span>
              )}
              <div className={`absolute bottom-[-2px] left-0 h-[2px] bg-on-surface transition-all ${
                activeTab === 'received' ? 'w-full' : 'w-0'
              }`} />
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className="pb-4 font-headline text-sm font-bold tracking-widest uppercase text-outline hover:text-on-surface transition-colors relative group"
            >
              Sent
              <div className={`absolute bottom-[-2px] left-0 h-[2px] bg-on-surface transition-all ${
                activeTab === 'sent' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
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

      {/* Background Floating Text */}
      <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.1] dark:opacity-[0.1] pointer-events-none select-none text-on-surface">
        <h1 className="font-headline font-black text-[20rem] leading-none tracking-tighter uppercase">
          Invite
        </h1>
      </div>
    </section>
  )
}
