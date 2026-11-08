import { CvBuilderData, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { jsPDF } from 'jspdf';

export class CandidateService {
  // Update candidate profile
  static async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('profiles')
          .update({
            name: data.name,
            phone: data.phone,
            title: data.title,
            bio: data.bio,
            education: data.education,
            experience_years: data.experienceYears,
            skills: data.skills,
            languages: data.languages,
            expected_salary_iqd: data.expectedSalaryIQD,
            target_job_type: data.targetJobType,
            cv_url: data.cvUrl,
            cv_data: data.cvData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      } catch (err) {
        console.warn('Supabase update profile error:', err);
      }
    }
  }

  // Generate downloadable PDF CV document using jsPDF
  static exportCvToPdf(cvData: CvBuilderData): jsPDF {
    const doc = new jsPDF();
    
    // Title & Name
    doc.setFontSize(18);
    doc.text(cvData.fullName || 'Sira Dhatia', 20, 20);
    
    doc.setFontSize(12);
    doc.text(cvData.jobTitle || 'Candidate', 20, 28);
    doc.text(`Email: ${cvData.email || '-'} | Phone: ${cvData.phone || '-'}`, 20, 36);
    doc.text(`Location: ${cvData.governorate || 'Iraq'}`, 20, 44);

    // Summary
    doc.setFontSize(14);
    doc.text('Professional Summary', 20, 56);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(cvData.summary || 'No summary provided', 170);
    doc.text(splitSummary, 20, 64);

    // Experience
    doc.setFontSize(14);
    doc.text('Work Experience', 20, 88);
    let yPos = 96;
    (cvData.experience || []).forEach(exp => {
      doc.setFontSize(11);
      doc.text(`${exp.position} - ${exp.company} (${exp.startDate} - ${exp.endDate})`, 20, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.text(exp.description || '', 20, yPos);
      yPos += 10;
    });

    // Education
    doc.setFontSize(14);
    doc.text('Education', 20, yPos + 4);
    yPos += 12;
    (cvData.education || []).forEach(edu => {
      doc.setFontSize(10);
      doc.text(`${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.graduationYear})`, 20, yPos);
      yPos += 8;
    });

    // Skills
    doc.setFontSize(14);
    doc.text('Skills & Languages', 20, yPos + 4);
    doc.setFontSize(10);
    doc.text(`Skills: ${(cvData.skills || []).join(', ')}`, 20, yPos + 12);
    doc.text(`Languages: ${(cvData.languages || []).join(', ')}`, 20, yPos + 20);

    return doc;
  }
}
