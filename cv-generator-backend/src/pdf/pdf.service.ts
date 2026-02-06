import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface CvData {
    fullName: string;
    jobTitle: string;
    company: string;
    generationDate: string;
    professionalSummary: string;
    workExperience: any[];
    education: any[];
    skills: any[];
    projects: any[];
}

@Injectable()
export class PdfService {
    async generatePdf(data: CvData, outputFilename: string): Promise<string> {
        const templatePath = path.join(process.cwd(), 'src/pdf/templates/cv.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template(data);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const uploadsDir = path.join(process.cwd(), 'uploads/cvs');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, outputFilename);
        const relativePath = `uploads/cvs/${outputFilename}`;

        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        });

        await browser.close();
        return relativePath;
    }
}
