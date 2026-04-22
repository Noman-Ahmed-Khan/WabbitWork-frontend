import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../stores/invitationStore'
import InvitationList from '../components/invitations/InvitationList'
import SentInvitationList from '../components/invitations/SentInvitationList'
import { containerVariants, itemVariants, cardVariants } from '../animations/variants'

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
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex-1 p-4 md:p-8 lg:p-12 bg-surface relative overflow-hidden"
    >
      {/* Background Kinetic Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <motion.h1 
          initial={{ opacity: 0, x: 200, scale: 1.2 }}
          animate={{ opacity: 0.1, x: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-[10rem] sm:text-[15rem] md:text-[20rem] font-black font-headline text-on-surface leading-none tracking-tighter uppercase"
          aria-hidden="true"
        >
          Invite
        </motion.h1>
      </div>

      {/* Header */}
      <motion.div variants={itemVariants} className="max-w-6xl mx-auto mb-8 md:mb-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-black tracking-[0.3em] uppercase text-tertiary mb-2 block"
            >
              Network & Access
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-on-surface uppercase leading-none">
              Invitations
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 md:gap-12 relative border-b-2 border-outline-variant/30 overflow-x-auto scrollbar-hide">
            {['received', 'sent'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`pb-4 font-headline text-sm uppercase tracking-widest relative group transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${
                  activeTab === tab ? 'font-black text-on-surface' : 'font-bold text-outline hover:text-on-surface'
                }`}
              >
                {tab}
                {tab === 'received' && pendingCount > 0 && (
                  <span className="ml-2 text-tertiary text-xs">{pendingCount}</span>
                )}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="tab-underline"
                    className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-tertiary shadow-[0_0_8px_rgba(var(--tertiary),0.3)]" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === 'received' && <InvitationList />}
            {activeTab === 'sent' && <SentInvitationList />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
