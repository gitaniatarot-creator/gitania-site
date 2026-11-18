#!/usr/bin/env bash
# Atajo: tools/set-vip-pass.sh usuario [contraseña]
exec python3 "$(dirname "$0")/set-vip-pass.py" "$@"
