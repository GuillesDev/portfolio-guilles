"""Comprueba que un PDF lleva embebidas las fuentes que se esperan.

Chrome embebe las fuentes variables (Sora, Source Sans 3, Literata) como Type3,
que no tienen /BaseFont: el nombre real vive en el /FontDescriptor. Mirar solo
/BaseFont da un falso negativo.
"""
import sys
import pypdf

RESERVA = ("Menlo", "Times", "Helvetica", "Courier")  # delatan que las webfonts no llegaron


def nombres(pdf):
    encontradas = set()
    for pagina in pypdf.PdfReader(pdf).pages:
        for _, fuente in pagina["/Resources"].get("/Font", {}).items():
            fuente = fuente.get_object()
            candidatos = [fuente] + [d.get_object() for d in (fuente.get("/DescendantFonts") or [])]
            for c in candidatos:
                if c.get("/BaseFont"):
                    encontradas.add(str(c["/BaseFont"]).split("+")[-1])
                descriptor = c.get("/FontDescriptor")
                if descriptor and descriptor.get_object().get("/FontName"):
                    encontradas.add(str(descriptor.get_object()["/FontName"]).split("+")[-1])
    return encontradas


def main():
    pdf, esperadas = sys.argv[1], sys.argv[2:]
    hay = nombres(pdf)
    plano = " ".join(hay).lower().replace(" ", "")
    faltan = [e for e in esperadas if e.lower().replace(" ", "") not in plano]
    reserva = [f for f in RESERVA if f.lower() in plano]
    if faltan or reserva:
        print(f"   fuentes mal - faltan: {faltan} | de reserva: {reserva} | hay: {sorted(hay)}")
        return 1
    print(f"   fuentes OK: {sorted(hay)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
