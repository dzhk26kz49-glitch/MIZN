import { Company, VerificationStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_COMPANIES } from '../data/mockData';

export class CompanyService {
  private static inMemoryCompanies: Company[] = [];

  // Get all registered companies
  static async getCompanies(): Promise<Company[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('companies').select('*');
        if (!error && data && data.length > 0) {
          return data as Company[];
        }
      } catch (err) {
        console.warn('Supabase fetch companies error:', err);
      }
    }

    if (this.inMemoryCompanies.length === 0) {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('mizn_companies');
        if (stored) {
          this.inMemoryCompanies = JSON.parse(stored);
        }
      }
      if (this.inMemoryCompanies.length === 0) {
        this.inMemoryCompanies = [...MOCK_COMPANIES];
      }
    }

    return this.inMemoryCompanies;
  }

  // Create or Update Company
  static async createCompany(newCompany: Omit<Company, 'id' | 'createdAt' | 'verificationStatus'>): Promise<Company> {
    const created: Company = {
      ...newCompany,
      id: `comp-${Date.now()}`,
      verificationStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('companies').insert([{
          id: created.id,
          name: created.name,
          sector: created.sector,
          governorate: created.governorate,
          city: created.city,
          description: created.description,
          website: created.website,
          contact_email: created.contactEmail,
          verification_status: 'Pending',
        }]);
      } catch (err) {
        console.warn('Supabase company insert error:', err);
      }
    }

    const currentList = await this.getCompanies();
    this.inMemoryCompanies = [created, ...currentList];

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mizn_companies', JSON.stringify(this.inMemoryCompanies));
    }

    return created;
  }

  // Admin Verification Update
  static async updateVerificationStatus(
    companyId: string,
    status: VerificationStatus,
    documentUrl?: string
  ): Promise<Company | null> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('companies')
          .update({
            verification_status: status,
            verification_document_url: documentUrl,
            verified_at: status === 'Verified' ? new Date().toISOString() : null,
          })
          .eq('id', companyId);
      } catch (err) {
        console.warn('Supabase company verification update error:', err);
      }
    }

    const currentList = await this.getCompanies();
    let updatedTarget: Company | null = null;

    this.inMemoryCompanies = currentList.map(c => {
      if (c.id === companyId) {
        updatedTarget = {
          ...c,
          verificationStatus: status,
          verificationDocumentUrl: documentUrl || c.verificationDocumentUrl,
          verifiedAt: status === 'Verified' ? new Date().toISOString() : c.verifiedAt,
        };
        return updatedTarget;
      }
      return c;
    });

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mizn_companies', JSON.stringify(this.inMemoryCompanies));
    }

    return updatedTarget;
  }
}
