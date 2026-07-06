// Native browser printing eliminates modern CSS parsing errors (like oklab)

export class PDFService {
  /**
   * Captures a DOM element and exports it as a highly formatted PDF document.
   */
  static async exportElementToPDF(elementId: string, filename: string = 'interview-report.pdf') {
    // Native print is much more robust for modern CSS (like oklab) than html2canvas
    // It creates a true text-selectable PDF rather than a compressed image.
    window.print()
  }
}
