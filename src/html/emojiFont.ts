import { Font } from '@react-pdf/renderer';

export function registerOpenEmojiFont() {
  Font.registerEmojiSource({
    format: "png",
    url: "/public/fonts/open-emoji/72x72/"
  })
}
