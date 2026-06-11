export type PrintType = 'ticket' | 'letter'

let printIdCounter = 0

export const PrinterHelper = {
  async print(html: string, type: PrintType): Promise<void> {
    const printId = `print-${++printIdCounter}-${Date.now()}`
    const hideStyleId = `${printId}-hide`
    const contentId = `${printId}-content`

    const hideStyle = document.createElement('style')
    hideStyle.id = hideStyleId
    hideStyle.textContent = `
      @media print {
        body > :not(#${contentId}) { display: none !important; }
        #${contentId} { display: block !important; }
      }
    `
    document.head.appendChild(hideStyle)

    const contentEl = document.createElement('div')
    contentEl.id = contentId
    contentEl.style.display = 'none'
    contentEl.innerHTML = `<style>
      @page { size: ${type === 'ticket' ? '80mm auto' : 'letter'}; margin: ${type === 'ticket' ? '0' : '20mm'}; }
      body { margin: 0; padding: 0; }
    </style>${html}`
    document.body.appendChild(contentEl)

    return new Promise<void>((resolve) => {
      let cleaned = false

      const cleanup = () => {
        if (cleaned) return
        cleaned = true
        const existingStyle = document.getElementById(hideStyleId)
        const existingContent = document.getElementById(contentId)
        existingStyle?.remove()
        existingContent?.remove()
        resolve()
      }

      window.onafterprint = cleanup

      const mql = window.matchMedia('print')
      const listener = (e: MediaQueryListEvent) => {
        if (!e.matches) {
          mql.removeEventListener('change', listener)
          cleanup()
        }
      }
      mql.addEventListener('change', listener)

      setTimeout(cleanup, 3000)
      window.print()
    })
  },
}
