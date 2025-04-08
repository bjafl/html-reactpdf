import { Styles as PDFStyles } from '@react-pdf/renderer'
export const defaultStyles: PDFStyles = {
li_bullet: {
    width: 30,
    textAlign: 'right',
    flexShrink: 0,
    flexGrow: 0,
    paddingRight: 5,
  },
  li_content: {
    textAlign: 'left',
    flexGrow: 1,
    flexBasis: 1,
  },
}