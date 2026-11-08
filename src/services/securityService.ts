import { AuditLog } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SecurityEvent {
  id: string;
  eventType: 'FAILED_LOGIN' | 'UNAUTHORIZED_ACCESS' | 'MALICIOUS_UPLOAD_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'ROLE_ELEVATION_ATTEMPT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export class SecurityService {
  private static securityEvents: SecurityEvent[] = [
    {
      id: 'sec-1',
      eventType: 'UNAUTHORIZED_ACCESS',
      severity: 'LOW',
      details: 'محاولة وصول مسار إداري غير مصرح بها وتطبيق الحجب التلقائي',
      ipAddress: '192.168.1.100',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
  ];

  private static rateLimiterStore: Map<string, number[]> = new Map();

  // 1. File Upload Security Validation (Type, Size & Extension Sanitization)
  static validateFileUpload(file: { name: string; size: number; type: string }): { valid: boolean; error: string | null } {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Max
    const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'];

    // Check size
    if (file.size > MAX_SIZE_BYTES) {
      return { valid: false, error: 'حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).' };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      this.logSecurityEvent('MALICIOUS_UPLOAD_ATTEMPT', 'HIGH', `محاولة رفع ملف بنوع غير مدعوم: ${file.type}`);
      return { valid: false, error: 'نوع الملف غير مدعوم. المسموح فقط ملفات PDF والصور (PNG, JPG).' };
    }

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      this.logSecurityEvent('MALICIOUS_UPLOAD_ATTEMPT', 'CRITICAL', `محاولة رفع ملف بامتداد مشبوه: ${file.name}`);
      return { valid: false, error: 'امتداد الملف غير آمن.' };
    }

    return { valid: true, error: null };
  }

  // 2. Rate Limiting Engine (Token Bucket / Sliding Window)
  static checkRateLimit(clientId: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const timestamps = this.rateLimiterStore.get(clientId) || [];

    // Filter out timestamps outside window
    const validTimestamps = timestamps.filter(t => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', 'MEDIUM', `تجاوز معدل الطلبات المسموح به للعميل ${clientId}`);
      return { allowed: false, remaining: 0 };
    }

    validTimestamps.push(now);
    this.rateLimiterStore.set(clientId, validTimestamps);
    return { allowed: true, remaining: maxRequests - validTimestamps.length };
  }

  // 3. Security Event Logging
  static logSecurityEvent(
    eventType: SecurityEvent['eventType'],
    severity: SecurityEvent['severity'],
    details: string,
    ipAddress?: string
  ): SecurityEvent {
    const event: SecurityEvent = {
      id: `sec-${Date.now()}`,
      eventType,
      severity,
      details,
      ipAddress: ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    this.securityEvents.unshift(event);
    return event;
  }

  // 4. Get Security Events Audit Log
  static getSecurityEvents(): SecurityEvent[] {
    return this.securityEvents;
  }
}
