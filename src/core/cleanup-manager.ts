import { APIRequestContext } from '@playwright/test';

export interface CleanupTask {
  method: 'DELETE' | 'POST' | 'PUT';
  url: string;
  token?: string;
  description: string;
}

export class CleanupManager {
  private tasks: CleanupTask[] = [];

  public register(task: CleanupTask) {
    this.tasks.push(task);
  }

  public async executeAll(request: APIRequestContext): Promise<{ passed: number, failed: number, errors: any[] }> {
    let passed = 0;
    let failed = 0;
    const errors: any[] = [];

    // Execute in reverse order (LIFO)
    while (this.tasks.length > 0) {
      const task = this.tasks.pop()!;
      try {
        const headers: Record<string, string> = {};
        if (task.token) {
          headers['Authorization'] = `Bearer ${task.token}`;
        }

        const response = await request.fetch(task.url, {
          method: task.method,
          headers: headers
        });

        if (response.ok()) {
          passed++;
        } else {
          failed++;
          errors.push(`[CLEANUP_FAILURE] ${task.description} - HTTP ${response.status()}`);
        }
      } catch (err: any) {
        failed++;
        errors.push(`[CLEANUP_FAILURE] ${task.description} - Error: ${err.message}`);
      }
    }

    return { passed, failed, errors };
  }
}
