import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExternalPdfService } from './pdf/external-pdf.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly externalPdfService: ExternalPdfService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-pdfmonkey')
  getTemplates() {
    return this.externalPdfService.getTemplates();
  }
}
