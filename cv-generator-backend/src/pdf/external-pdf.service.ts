import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalPdfService {
  private readonly logger = new Logger(ExternalPdfService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.pdfmonkey.io/api/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('PDFMONKEY_API_KEY') || '';
  }

  async getTemplates() {
    if (!this.apiKey) {
      throw new Error('PDFMONKEY_API_KEY is not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}/document_templates`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to fetch templates: ${response.status} ${error}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Error fetching templates', error);
      throw error;
    }
  }

  async generateDocument(templateId: string, payload: any) {
    if (!this.apiKey) {
      throw new Error('PDFMONKEY_API_KEY is not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}/documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: {
            document_template_id: templateId,
            payload: payload,
            status: 'pending', // or success? usually pending then webhook.
            // But PDFMonkey returns document immediately? No, it's async.
            // Actually, creating a document triggers generation.
            // We need to poll or wait.
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to create document: ${response.status} ${error}`,
        );
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Error creating document', error);
      throw error;
    }
  }
}
