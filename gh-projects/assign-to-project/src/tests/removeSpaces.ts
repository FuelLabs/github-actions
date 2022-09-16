export function removeSpaces(text: string) {
  return text.replace(/ {2}|\r\n|\n|\r/gm, '');
}
