import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUpload } from './avatar-upload';
import type { Profile } from '@/types/supabase';

interface ProfileAvatarViewProps {
  profile: Profile;
  onAvatarUpdate: (url: string) => Promise<void>;
}

export function ProfileAvatarView({
  profile,
  onAvatarUpdate,
}: ProfileAvatarViewProps) {
  return (
    <div className="relative">
      <div className="relative group">
        <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-offset-background ring-border transition-transform hover:scale-105">
          <AvatarImage
            src={profile.avatar_url || ''}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">
            {profile.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <AvatarUpload userId={profile.id} onUploadComplete={onAvatarUpdate} />
      </div>
    </div>
  );
}
