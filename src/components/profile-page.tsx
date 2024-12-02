import { ProfileDashboard } from "./profile/profile-dashboard"

interface ProfilePageProps {
  onBack: () => void
  onTournamentClick: () => void
}

export function ProfilePage({ onBack, onTournamentClick }: ProfilePageProps) {
  return <ProfileDashboard onBack={onBack} onTournamentClick={() => {
    onBack()
    onTournamentClick()
  }} />
}