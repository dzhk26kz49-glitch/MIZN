import { Job, NotificationItem, Opportunity } from '../types';

export interface AutomationTaskLog {
  id: string;
  taskName: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'PAUSED';
  itemsProcessed: number;
  details: string;
  durationMs: number;
  timestamp: string;
}

export class AutomationService {
  private static isAutomationEnabled: boolean = true;
  private static taskLogs: AutomationTaskLog[] = [
    {
      id: 'task-init-1',
      taskName: 'فحص الإعلانات المنتهية الصلاحية (Auto Expiry Check)',
      status: 'SUCCESS',
      itemsProcessed: 12,
      details: 'تم فحص جميع الإعلانات وتحديث حالة الوظائف القديمة بنجاح',
      durationMs: 45,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    }
  ];
  private static recentNotificationHashes: Set<string> = new Set();

  // 1. Toggle Master Automation Switch (Kill Switch)
  static setAutomationMasterSwitch(enabled: boolean): void {
    this.isAutomationEnabled = enabled;
  }

  static getMasterSwitchStatus(): boolean {
    return this.isAutomationEnabled;
  }

  // 2. Get Automation Logs
  static getTaskLogs(): AutomationTaskLog[] {
    return this.taskLogs;
  }

  // 3. Deduplicated Notification Dispatcher (Prevents loops & duplicate spam)
  static shouldSendNotification(userId: string, title: string, message: string): boolean {
    const hash = `${userId}:${title}:${message}`;
    if (this.recentNotificationHashes.has(hash)) {
      return false; // Spam prevented
    }
    this.recentNotificationHashes.add(hash);
    
    // Clear hash after 5 minutes to prevent memory leak
    setTimeout(() => {
      this.recentNotificationHashes.delete(hash);
    }, 300000);

    return true;
  }

  // 4. Execute Auto-Job Expiry Check Task
  static runAutoExpiryTask(jobs: Job[]): { updatedJobs: Job[]; log: AutomationTaskLog } {
    const startTime = Date.now();
    if (!this.isAutomationEnabled) {
      const pausedLog: AutomationTaskLog = {
        id: `task-${Date.now()}`,
        taskName: 'فحص الإعلانات المنتهية الصلاحية',
        status: 'PAUSED',
        itemsProcessed: 0,
        details: 'تم إيقاف الأتمتة مؤقتاً عبر مفتاح الأمان (Master Kill Switch)',
        durationMs: 0,
        timestamp: new Date().toISOString(),
      };
      this.taskLogs.unshift(pausedLog);
      return { updatedJobs: jobs, log: pausedLog };
    }

    const now = new Date();
    let expiredCount = 0;

    const updatedJobs = jobs.map(job => {
      if (job.status === 'Active' && job.expiresAt) {
        if (new Date(job.expiresAt) < now) {
          expiredCount++;
          return { ...job, status: 'Closed' as const };
        }
      }
      return job;
    });

    const durationMs = Date.now() - startTime;
    const log: AutomationTaskLog = {
      id: `task-${Date.now()}`,
      taskName: 'فحص الإعلانات المنتهية الصلاحية',
      status: 'SUCCESS',
      itemsProcessed: expiredCount,
      details: `تم فحص ${jobs.length} وظيفة وإغلاق ${expiredCount} إعلان منتهي`,
      durationMs,
      timestamp: new Date().toISOString(),
    };

    this.taskLogs.unshift(log);
    return { updatedJobs, log };
  }

  // 5. Execute Opportunity Deadline Warning Task
  static checkOpportunityDeadlines(opportunities: Opportunity[]): { expiringCount: number; log: AutomationTaskLog } {
    const startTime = Date.now();
    if (!this.isAutomationEnabled) {
      const pausedLog: AutomationTaskLog = {
        id: `task-${Date.now()}`,
        taskName: 'مراقبة مواعيد المنح والفرص',
        status: 'PAUSED',
        itemsProcessed: 0,
        details: 'الأتمتة متوقفة',
        durationMs: 0,
        timestamp: new Date().toISOString(),
      };
      this.taskLogs.unshift(pausedLog);
      return { expiringCount: 0, log: pausedLog };
    }

    const now = new Date();
    const threeDaysMs = 86400000 * 3;
    let expiringCount = 0;

    opportunities.forEach(op => {
      const deadline = new Date(op.deadline);
      const diff = deadline.getTime() - now.getTime();
      if (diff > 0 && diff <= threeDaysMs) {
        expiringCount++;
      }
    });

    const log: AutomationTaskLog = {
      id: `task-${Date.now()}`,
      taskName: 'مراقبة مواعيد المنح والفرص القريبة',
      status: 'SUCCESS',
      itemsProcessed: expiringCount,
      details: `تم رصد ${expiringCount} فرصة سينتهي تقديمها خلال 3 أيام`,
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };

    this.taskLogs.unshift(log);
    return { expiringCount, log };
  }
}
