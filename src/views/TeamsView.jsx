import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../layouts/Shell'
import Panel from '../layouts/Panel'
import TeamPanel from '../components/panels/TeamPanel'
import MemberPanel from '../components/panels/MemberPanel'
import Button from '../components/primitives/Button'
import Input from '../components/primitives/Input'
import Spinner from '../components/primitives/Spinner'
import TeamOverlay from '../components/overlays/TeamOverlay'
import MemberOverlay from '../components/overlays/MemberOverlay'
import useTeamStore from '../stores/teamStore'
import useUIStore from '../stores/uiStore'
import useAuthStore from '../stores/authStore'

export default function TeamsView() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Zustand stores
  const {
    teams,
    selectedTeam,
    members,
    loading,
    loadTeams,
    selectTeam,
    loadMembers,
    deleteTeam,
    updateMemberRole,
    removeMember,
    leaveTeam,
  } = useTeamStore()

  const { activeOverlay, openOverlay } = useUIStore()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  const handleManageMembers = async (team) => {
    selectTeam(team)
    await loadMembers(team.id)
  }

  const handleEditTeam = (team) => {
    openOverlay('team', team)
  }

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Delete this team? This will also delete all its tasks.')) return
    
    try {
      await deleteTeam(teamId)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateRole = async (memberId, role) => {
    try {
      await updateMemberRole(selectedTeam.id, memberId, role)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRemoveMember = async (memberId) => {
    const member = members.find(m => m.id === memberId)
    const isCurrentUser = member?.user_id === user?.id

    if (!confirm(isCurrentUser ? 'Leave this team?' : 'Remove this member?')) return

    try {
      if (isCurrentUser) {
        await leaveTeam(selectedTeam.id)
      } else {
        await removeMember(selectedTeam.id, memberId)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && teams.length === 0) {
    return (
      <Shell>
        <Spinner />
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6 mb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Teams</h1>
            <p className="text-base-content/60">Manage your teams and members</p>
          </div>
          <Button
            variant="primary"
            onClick={() => openOverlay('team')}
          >
            + Create Team
          </Button>
        </div>

        {/* Search */}
        <Panel>
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Panel>

        {/* Teams Grid */}
        {filteredTeams.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <TeamPanel
                key={team.id}
                team={team}
                onView={() => navigate('/tasks', { state: { teamId: team.id } })}
                onEdit={handleEditTeam}
                onDelete={handleDeleteTeam}
                onManageMembers={handleManageMembers}
              />
            ))}
          </div>
        ) : (
          <Panel>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">
                {searchTerm ? 'No teams found' : 'No teams yet'}
              </h3>
              <p className="text-base-content/60 mb-6">
                {searchTerm 
                  ? 'Try a different search term' 
                  : 'Create your first team to get started'}
              </p>
              {!searchTerm && (
                <Button
                  variant="primary"
                  onClick={() => openOverlay('team')}
                >
                  Create Team
                </Button>
              )}
            </div>
          </Panel>
        )}

        {/* Members Panel (slides in when team selected) */}
        {selectedTeam && (
          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <button
                  onClick={() => selectTeam(null)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  ←
                </button>
                <span>{selectedTeam.name} Members</span>
                <span className="badge badge-neutral">{members.length}</span>
              </h2>

              {(selectedTeam.role === 'owner' || selectedTeam.role === 'admin') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openOverlay('member')}
                >
                  + Add Member
                </Button>
              )}
            </div>

            {loading ? (
              <Spinner size="sm" />
            ) : members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member) => (
                  <MemberPanel
                    key={member.id}
                    member={member}
                    currentUserRole={selectedTeam.role}
                    currentUserId={user?.id}
                    onUpdateRole={handleUpdateRole}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/60">
                No members yet
              </div>
            )}
          </Panel>
        )}
      </div>

      {/* Overlays */}
      {activeOverlay === 'team' && (
        <TeamOverlay onSuccess={loadTeams} />
      )}
      {activeOverlay === 'member' && (
        <MemberOverlay
          teamId={selectedTeam?.id}
          onSuccess={() => loadMembers(selectedTeam.id)}
        />
      )}
    </Shell>
  )
}