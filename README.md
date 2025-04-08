# HTML to React PDF

An HTML-to-PDF converter component for React PDF. This library allows you to easily convert HTML content to PDF documents using React PDF renderer.

## Installation

```bash
npm install html-to-react-pdf @react-pdf/renderer
```

## Features

- Convert HTML strings to React PDF documents
- Support for custom headers and footers
- Customizable page sizes and margins
- Basic table support
- Style customization via stylesheets
- Emoji support

## Usage

### Basic Example

```jsx
import { HtmlToPdfDoc, HtmlToPdfViewer } from 'html-to-react-pdf';
import { PDFViewer } from '@react-pdf/renderer';

const MyDocument = () => (
  <PDFViewer>
    <HtmlToPdfDoc>
      <h1>Hello, World!</h1>
      <p>This is an HTML string that will be converted to a PDF document.</p>
      <table>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
        <tr>
          <td>Cell 1</td>
          <td>Cell 2</td>
        </tr>
      </table>
    </HtmlToPdfDoc>
  </PDFViewer>
);
```

### With Headers and Footers

```jsx
import { HtmlToPdfDoc, Header, Footer } from 'html-to-react-pdf';

const DocumentWithHeaderAndFooter = () => (
  <HtmlToPdfDoc>
    <Header>
      <Text style={{ textAlign: 'center' }}>Document Title</Text>
    </Header>
    <Footer>
      <Text style={{ textAlign: 'center' }}>Page <PageNumber /> of <PageCount /></Text>
    </Footer>
    <div>
      <h1>Document with Header and Footer</h1>
      <p>This document includes a header and footer.</p>
    </div>
  </HtmlToPdfDoc>
);
```

### Custom Styling

```jsx
import { HtmlToPdfDoc } from 'html-to-react-pdf';

const customStyles = {
  h1: {
    color: 'red',
    fontSize: 24,
  },
  p: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
  },
};

const StyledDocument = () => (
  <HtmlToPdfDoc htmlProps={{ stylesheet: customStyles }}>
    <h1>Custom Styled Document</h1>
    <p>This document has custom styling applied.</p>
  </HtmlToPdfDoc>
);
```

## API Reference

### `<HtmlToPdfDoc>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| htmlProps | object | {} | Props to pass to the HTML component |
| pageSize | string | 'A4' | Page size (A4, letter, etc.) |
| margins | object | `{ top: 65, bottom: 65, left: 65, right: 65 }` | Page margins |

### `<HtmlToPdfViewer>` Props

Extends `HtmlToPdfDoc` props with additional properties:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | string/number | '100%' | Viewer width |
| height | string/number | '100%' | Viewer height |

### `<HTML>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| stylesheet | object | {} | Custom styles to apply to HTML elements |
| overrideStyles | object | {} | Styles that override the default styles |
| docDpi | number | | Document DPI |
| preprocessHtml | boolean | true | Enable/disable HTML pre-processing |
| enableEmojiSupport | boolean | true | Enable/disable emoji rendering |

## License

MIT