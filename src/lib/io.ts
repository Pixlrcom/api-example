/**
 * Read a file as a Data Url, which is base64 encoded data with a little bit on prefixed metadata
 * @param file A file to read
 */
export function readFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.addEventListener('load', (e) => {
            if (fr.error) reject(fr.error)
            else resolve(fr.result as string)
        });
        fr.readAsDataURL(file);
    });
}

