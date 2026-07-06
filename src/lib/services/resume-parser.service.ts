import mammoth from 'mammoth'

export class ResumeParserService {
  /**
   * Parses raw file buffers (PDF or DOCX) into plain text for AI ingestion.
   */
  static async parseFile(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      const { extractText } = await import('unpdf');
      const uint8Array = new Uint8Array(buffer);
      const { text } = await extractText(uint8Array);
      return Array.isArray(text) ? text.join('\n') : text;
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
