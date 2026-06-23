// src/modules/backup/backup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  /**
   * Runs a PostgreSQL backup every day at 03:00 AM.
   * Backups are stored in /project-root/backups/ and the last 10 are kept.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runScheduledBackup() {
    this.logger.log('Starting scheduled database backup...');
    await this.backup();
  }

  async backup(): Promise<string> {
    const scriptPath = path.resolve(__dirname, '../../../../scripts/backup-db.sh');

    if (!fs.existsSync(scriptPath)) {
      this.logger.error(`Backup script not found at: ${scriptPath}`);
      throw new Error('Backup script not found');
    }

    try {
      const { stdout, stderr } = await execAsync(`bash "${scriptPath}"`);
      if (stdout) this.logger.log(stdout.trim());
      if (stderr) this.logger.warn(stderr.trim());
      this.logger.log('Scheduled backup completed successfully');
      return stdout;
    } catch (error) {
      this.logger.error('Backup failed', error.message);
      throw error;
    }
  }
}
