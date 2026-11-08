import { UserProfile, UserRole, IraqiGovernorate } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_USERS } from '../data/mockData';

export interface RegisterUserData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  governorate: IraqiGovernorate;
  city: string;
}

export class AuthService {
  // 1. Register User (Supabase Auth + Public Profiles record)
  static async signUp(data: RegisterUserData): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isSupabaseConfigured()) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password || 'MiznSecuredPass2026!',
          options: {
            data: {
              name: data.name,
              role: data.role,
              governorate: data.governorate,
            },
          },
        });

        if (authError) return { user: null, error: authError.message };

        if (authData.user) {
          const profile: UserProfile = {
            id: authData.user.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            governorate: data.governorate,
            city: data.city || 'المركز',
            skills: ['إدارة المهام', 'التواصل المهني'],
            languages: ['العربية'],
            createdAt: new Date().toISOString(),
          };

          // Insert into profiles table with RLS enforcement
          const { error: profileError } = await supabase.from('profiles').insert([{
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
            governorate: profile.governorate,
            city: profile.city,
            skills: profile.skills,
            languages: profile.languages,
          }]);

          if (profileError) {
            console.warn('Profile insert error:', profileError);
          }

          return { user: profile, error: null };
        }
      } catch (err: any) {
        return { user: null, error: err?.message || 'فشل التسجيل السحابي' };
      }
    }

    // Local / Demo Fallback implementation
    const newUser: UserProfile = {
      id: `usr-supabase-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+964 770 000 0000',
      role: data.role,
      governorate: data.governorate,
      city: data.city || 'المركز',
      skills: ['التواصل المهني', 'التنظيم'],
      languages: ['العربية'],
      createdAt: new Date().toISOString(),
    };

    return { user: newUser, error: null };
  }

  // 2. Sign In User
  static async signIn(email: string, password?: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isSupabaseConfigured()) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'MiznSecuredPass2026!',
        });

        if (authError) return { user: null, error: authError.message };

        if (authData.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileData) {
            return { user: profileData as UserProfile, error: null };
          }
        }
      } catch (err: any) {
        return { user: null, error: err?.message };
      }
    }

    // Local lookup
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      return { user: found, error: null };
    }

    return {
      user: {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'JOB_SEEKER',
        governorate: 'بغداد (Baghdad)',
        city: 'المنصور',
        skills: ['العمل الجماعي'],
        languages: ['العربية'],
        createdAt: new Date().toISOString(),
      },
      error: null,
    };
  }

  // 3. Sign Out
  static async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  }

  // 4. Role Authorization Helper
  static hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
    if (userRole === 'SUPER_ADMIN') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
  }
}
