import { useState } from 'react';
import { Pencil, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ProfileAvatarView } from './avatar/profile-avatar-view';
import { PasswordForm } from './password/password-form';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { fadeIn, slideIn, scaleIn } from '@/lib/animations';

export function ProfileAvatar() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const { profile, isLoading, updateProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();

  if (isLoading || !profile) {
    return null;
  }

  const handleAvatarUpdate = async (avatarUrl: string) => {
    await updateProfile({ avatarUrl });
  };

  const handleUsernameSubmit = async () => {
    if (!editedUsername.trim()) {
      toast({
        title: 'Error',
        description: 'Username cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateProfile({ username: editedUsername });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Username updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update username',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn('rounded-lg border bg-card p-6', fadeIn)}>
      <div className="flex items-start gap-6">
        <ProfileAvatarView
          profile={profile}
          onAvatarUpdate={handleAvatarUpdate}
        />
        <div className="flex-1 space-y-4">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                className="text-base"
                placeholder="Enter username"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUsernameSubmit();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUsernameSubmit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUsername(profile.username || '');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{profile.username}</h2>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedUsername(profile.username || '');
                  }}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors bg-transparent transform translate-y-[-10px] p-0"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Lock className="h-4 w-4" />
                <span>••••••••</span>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors bg-transparent transform translate-y-[-10px] p-0"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {isChangingPassword && (
            <div className="mt-4 pt-4 border-t -ml-[100px]">
              <PasswordForm onCancel={() => setIsChangingPassword(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
