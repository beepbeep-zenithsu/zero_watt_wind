#!/bin/sh
cd "$(dirname "$0")"
(sleep 1; (open http://localhost:5500 || xdg-open http://localhost:5500) >/dev/null 2>&1) &
node serve.js
