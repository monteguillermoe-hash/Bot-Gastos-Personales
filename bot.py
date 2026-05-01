
import os
import re
import logging
from datetime import datetime
from dotenv import load_dotenv
import shlex
import requests
import json
import gspread
from google.oauth2.service_account import Credentials
from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
)

# ── Configuración ─────────────────────────────────────────────────────────────
load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
SPREADSHEET_ID = os.getenv("SHEET_ID")
SHEET_RANGE    = os.getenv("SHEET_RANGE")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# ── Autenticación con Google Sheets ──────────────────────────────────────────
creds_json = os.getenv("GOOGLE_CREDENTIALS")
if not creds_json:
    raise Exception("GOOGLE_CREDENTIALS no está configurada en Render")

creds_data = json.loads(creds_json)
creds = Credentials.from_service_account_info(creds_data, scopes=SCOPES)
client = gspread.authorize(creds)

# Abrir la hoja
sheet = client.open_by_key(SPREADSHEET_ID).worksheet("Gastos Personales 2026")

# ── Funciones auxiliares (clasificación, dólar, etc.) ─────────────────────────
# … (dejá tus funciones de clasificar_rubro, clasificar_medio, obtener_dolar_bna, etc. tal cual)

# ── Handlers de Telegram ─────────────────────────────────────────────────────
# … (dejá cmd_ayuda y cmd_gasto tal cual)

# ── Punto de entrada ─────────────────────────────────────────────────────────
def main() -> None:
    if not TELEGRAM_TOKEN:
        raise ValueError("TELEGRAM_TOKEN no está definido en Render")

    logger.info("Autenticación exitosa. Iniciando bot de Telegram…")

    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("ayuda", cmd_ayuda))
    app.add_handler(CommandHandler("start", cmd_ayuda))
    app.add_handler(CommandHandler("gasto", cmd_gasto))

    logger.info("Bot corriendo. Esperando mensajes…")
    app.run_polling()

if __name__ == "__main__":
    main()
