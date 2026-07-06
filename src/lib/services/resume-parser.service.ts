import mammoth from 'mammoth'

export class ResumeParserService {
  /**
   * Parses raw file buffers (PDF or DOCX) into plain text for AI ingestion.
   */
  static async parseFile(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      // Polyfill browser APIs required by pdfjs-dist in Node.js (Vercel Serverless)
      if (typeof globalThis !== 'undefined') {
        if (!globalThis.DOMMatrix) {
          (globalThis as any).DOMMatrix = class DOMMatrix {} as any;
        }
        if (!globalThis.Path2D) {
          (globalThis as any).Path2D = class Path2D {} as any;
        }
      }

      // Dynamically import to prevent Next.js top-level Canvas/DOMMatrix crashes
      const { PDFParse } = await import('pdf-parse');
      const pdf = new PDFParse({ data: buffer });
      const data = await pdf.getText();
      return data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    } else {
      throw new Error("Unsupported file format. Please upload PDF or DOCX.")
    }
  }
}
