#!/usr/bin/env python3
"""Pone (o cambia) usuario y contraseña de una clienta VIP v2.

Uso:
  python3 tools/set-vip-pass.py ana              # pide la contraseña sin mostrarla
  python3 tools/set-vip-pass.py ana "contraseña larga aquí"

Qué hace:
  1. Busca la carpeta de la clienta: clientes/<carpeta>/<usuario>-manual.html
  2. Calcula el hash PBKDF2 (igual que vip.html) y lo pone en esa página y en VIP_HASHES_V2 de vip.html
     (reemplaza el hash anterior de esa clienta; Elois no se toca).
  3. Renombra la carpeta al nombre que vip.html calcula con los nuevos datos (git mv).
     Así, al cambiar la contraseña, el link viejo deja de funcionar.
No hace commit ni push.
"""
import getpass, glob, hashlib, os, re, subprocess, sys

ITER = 200000
MIN_LEN = 12
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def derive(user, pw):
    return hashlib.pbkdf2_hmac("sha256", pw.encode(), ("gitania-vip:" + user).encode(), ITER).hex()


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    user = sys.argv[1].strip().lower()
    pw = sys.argv[2].strip() if len(sys.argv) > 2 else getpass.getpass("contraseña: ").strip()
    if len(pw) < MIN_LEN:
        sys.exit(f"La contraseña es muy corta ({len(pw)}). Usa {MIN_LEN} o más caracteres; "
                 "mejor una frase de 3-4 palabras, p. ej. 'luna-cobre-rio-27'.")
    if not re.fullmatch(r"[a-z0-9._-]+", user):
        sys.exit("Usuario: solo minúsculas, números, punto, guion o guion bajo.")

    pages = glob.glob(os.path.join(ROOT, "clientes", "*", f"{user}-manual.html"))
    pages = [p for p in pages if 'accessHash:' in open(p, encoding="utf-8").read()]
    if len(pages) != 1:
        sys.exit(f"No encontré una sola página v2 para '{user}' (encontré {len(pages)}).")
    page = pages[0]
    html = open(page, encoding="utf-8").read()
    old = re.search(r'accessHash:\s*"([^"]+)"', html).group(1)

    new = derive(user, pw)
    folder = hashlib.sha256(("gitania-path-v2:" + new).encode()).hexdigest()[:32]

    vip_path = os.path.join(ROOT, "vip.html")
    vip = open(vip_path, encoding="utf-8").read()
    m = re.search(r"const VIP_HASHES_V2 = \[(.*?)\];", vip)
    items = re.findall(r'"([^"]+)"', m.group(1))
    if old in items:
        items[items.index(old)] = new
    elif new not in items:
        items.append(new)
    vip = vip[:m.start()] + "const VIP_HASHES_V2 = [" + ", ".join(f'"{h}"' for h in items) + "];" + vip[m.end():]
    open(vip_path, "w", encoding="utf-8").write(vip)

    html = html.replace(f'accessHash: "{old}"', f'accessHash: "{new}"')
    open(page, "w", encoding="utf-8").write(html)

    cur = os.path.dirname(page)
    dest = os.path.join(ROOT, "clientes", folder)
    if os.path.abspath(cur) != os.path.abspath(dest):
        r = subprocess.run(["git", "mv", cur, dest], cwd=ROOT)
        if r.returncode != 0:
            os.rename(cur, dest)
    print("Listo.")
    print(f"  usuario:  {user}")
    print(f"  carpeta:  clientes/{folder}/")
    print("  Revisa con git status / git diff y luego haz commit. (No se publicó nada.)")


if __name__ == "__main__":
    main()
