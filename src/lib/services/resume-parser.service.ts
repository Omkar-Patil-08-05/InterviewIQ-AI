import mammoth from 'mammoth'

export class ResumeParserService {
  /**
   * Parses raw file buffers (PDF or DOCX) into plain text for AI ingestion.
   */
  static async parseFile(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      // Dynamically import to prevent Next.js top-level Canvas/DOMMatrix crashes
      const { PDFParse } = require('pdf-parse')
      const pdf = new PDFParse({ data: buffer })
      const data = await pdf.getText()
      return data.text
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
