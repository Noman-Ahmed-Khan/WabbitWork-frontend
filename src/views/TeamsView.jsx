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
import teamsApi from '../api/teams'
import { useUI } from '../state/ui.store'
import { useAuth } from '../state/auth.store'

export default function TeamsView() {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { activeOverlay, openOverlay, closeOverlay } = useUI()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await teamsApi.getAll()
      setTeams(response.data.teams)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMembers = async (teamId) => {
    try {
      setMembersLoading(true)
      const response = await teamsApi.getMembers(teamId)
      setMembers(response.data.members)
    } catch (err) {
      alert(err.message)
    } finally {
      setMembersLoading(false)
    }
  }

  const handleViewTeam = (team) => {
    navigate('/tasks', { state: { teamId: team.id } })
  }

  const handleManageMembers = async (team) => {
    setSelectedTeam(team)
    await loadMembers(team.id)
  }

  const handleEditTeam = (team) => {
    openOverlay('team', team)
  }

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Delete this team? This will also delete all its tasks.')) return

    try {
      await teamsApi.delete(teamId)
      loadTeams()
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateRole = async (memberId, role) => {
    try {
      await teamsApi.updateMemberRole(selectedTeam.id, memberId, { role })
      await loadMembers(selectedTeam.id)
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
        await teamsApi.leaveTeam(selectedTeam.id)
        setSelectedTeam(null)
        loadTeams()
      } else {
        await teamsApi.removeMember(selectedTeam.id, memberId)
        await loadMembers(selectedTeam.id)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentUserRole = selectedTeam?.role

  if (loading) {
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
                onView={handleViewTeam}
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
                  onClick={() => setSelectedTeam(null)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  ←
                </button>
                <span>{selectedTeam.name} Members</span>
                <span className="badge badge-neutral">{members.length}</span>
              </h2>

              {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openOverlay('member')}
                >
                  + Add Member
                </Button>
              )}
            </div>

            {membersLoading ? (
              <Spinner size="sm" />
            ) : members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member) => (
                  <MemberPanel
                    key={member.id}
                    member={member}
                    currentUserRole={currentUserRole}
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