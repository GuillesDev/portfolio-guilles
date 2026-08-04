import { openSync, readSync, closeSync, statSync } from 'node:fs';

/**
 * ¿Tiene el MP4 una pista de audio?
 *
 * Se resuelve en compilación, no en el navegador: `audioTracks` no existe en
 * Chrome y `webkitAudioDecodedByteCount` solo dice algo cuando ya ha empezado
 * a decodificar, así que en el cliente no hay forma fiable de saberlo antes de
 * pintar.
 *
 * Recorre las cajas de primer nivel leyendo solo sus cabeceras hasta dar con
 * `moov`, y únicamente esa se lee entera. Así no se cargan en memoria los
 * ~94 MB de vídeo de la página en cada compilación.
 */
export function hasAudioTrack(filePath: string): boolean {
  let fd: number;
  try {
    fd = openSync(filePath, 'r');
  } catch {
    // Ante la duda no se marca nada, pero que se vea en el log: un fallo de
    // ruta aquí daría cero avisos sin que nadie se entere.
    console.warn(`[hasAudioTrack] no se pudo abrir ${filePath}`);
    return true;
  }

  try {
    const size = statSync(filePath).size;
    const header = Buffer.alloc(16);
    let offset = 0;

    while (offset + 8 <= size) {
      const read = readSync(fd, header, 0, 16, offset);
      if (read < 8) break;

      let boxSize = header.readUInt32BE(0);
      const boxType = header.toString('latin1', 4, 8);
      let headerSize = 8;

      if (boxSize === 1) {
        // Tamaño de 64 bits: viene justo detrás del tipo.
        if (read < 16) break;
        boxSize = Number(header.readBigUInt64BE(8));
        headerSize = 16;
      } else if (boxSize === 0) {
        // Se extiende hasta el final del archivo.
        boxSize = size - offset;
      }

      if (boxSize < headerSize) break;

      if (boxType === 'moov') {
        const moov = Buffer.alloc(boxSize - headerSize);
        readSync(fd, moov, 0, moov.length, offset + headerSize);
        // El tipo de manejador va 12 bytes después del literal `hdlr`:
        // versión y flags (4) + pre_defined (4) + handler_type (4).
        let i = 0;
        while ((i = moov.indexOf('hdlr', i, 'latin1')) !== -1) {
          if (moov.toString('latin1', i + 12, i + 16) === 'soun') return true;
          i += 4;
        }
        return false;
      }

      offset += boxSize;
    }

    return false;
  } catch {
    return true;
  } finally {
    closeSync(fd);
  }
}
