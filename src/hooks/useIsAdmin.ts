import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface AdminCheck {
  userId: string;
  isAdmin: boolean;
}

export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [check, setCheck] = useState<AdminCheck | null>(null);

  useEffect(() => {
    if (!userId) {
      setCheck(null);
      return;
    }
    let active = true;
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setCheck({ userId, isAdmin: data !== null });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const resolved = userId !== null && check?.userId === userId;
  return {
    isAdmin: resolved && check.isAdmin,
    loading: authLoading || (userId !== null && !resolved),
  };
}
