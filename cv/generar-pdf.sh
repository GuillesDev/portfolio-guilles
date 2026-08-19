#!/bin/bash
# Genera los PDF del CV desde su HTML (equivalente de generar-pdf.ps1 para macOS).
#
#   ./cv/generar-pdf.sh              genera los dos CV
#   ./cv/generar-pdf.sh cv.html      genera solo ese
#
# Comprueba que las fuentes web se han embebido de verdad. Sin esa comprobación
# Chrome imprime con las de reserva del sistema si Google Fonts tarda, y el PDF
# sale con otra tipografía sin avisar: así se generaron los PDF de julio.
set -u
AQUI="$(cd "$(dirname "$0")" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "No está Google Chrome en $CHROME"; exit 1; }

# html : fuentes que tienen que acabar dentro del PDF
FUENTES_cv="Sora SourceSans3 IBMPlexMono"
FUENTES_corporativo="Literata SourceSans3 IBMPlexMono"

imprime() {
  local html="$1" pdf="${1%.html}.pdf" esperadas="$2" perfil
  perfil="$(mktemp -d)"
  for intento in 1 2 3; do
    rm -f "$pdf"
    "$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
      --user-data-dir="$perfil" --virtual-time-budget=20000 \
      --print-to-pdf="$pdf" --print-to-pdf-no-header "file://$html" >/dev/null 2>&1 &
    local chrome_pid=$! prev=-1 cur
    for _ in $(seq 1 45); do          # Chrome no siempre se cierra solo al terminar
      sleep 1
      if [ -s "$pdf" ]; then
        cur=$(stat -f%z "$pdf")
        [ "$cur" = "$prev" ] && break
        prev=$cur
      fi
    done
    kill $chrome_pid 2>/dev/null; wait $chrome_pid 2>/dev/null
    if python3 "$AQUI/comprobar-fuentes.py" "$pdf" $esperadas; then
      rm -rf "$perfil"
      echo "  -> $(basename "$pdf") ($(( $(stat -f%z "$pdf") / 1024 )) KB)"
      return 0
    fi
    echo "  intento $intento: fuentes incompletas, reintento"
  done
  rm -rf "$perfil"
  echo "FALLO: $(basename "$pdf") se imprimió sin las fuentes web. ¿Hay conexión?"
  return 1
}

if [ $# -gt 0 ]; then
  entradas=("$@")
else
  entradas=("$AQUI/guillermo-lopez-cv.html" "$AQUI/guillermo-lopez-cv-corporativo.html")
fi

fallos=0
for html in "${entradas[@]}"; do
  case "$html" in
    *corporativo*) esperadas="$FUENTES_corporativo" ;;
    *)             esperadas="$FUENTES_cv" ;;
  esac
  echo "$(basename "$html")"
  imprime "$html" "$esperadas" || fallos=1
done

# La web sirve los de public/cv, así que los dos sitios van juntos o se desincronizan.
if [ $fallos -eq 0 ]; then
  cp "$AQUI"/guillermo-lopez-cv.pdf "$AQUI"/guillermo-lopez-cv-corporativo.pdf "$AQUI/../public/cv/"
  echo "Copiados a public/cv/"
fi
exit $fallos
