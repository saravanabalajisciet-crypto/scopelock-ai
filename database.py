
import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row


# Load the project environment variables.
load_dotenv(Path(__file__).with_name(".env"))

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    """Return a PostgreSQL connection using the configured Neon URL."""

    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL is missing. Configure it in the project .env file."
        )

    return psycopg.connect(
        DATABASE_URL,
        connect_timeout=10,
        row_factory=dict_row,
    )


def init_db():
    """Create or update the ScopeLock PostgreSQL tables."""

    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS payment_orders (
                order_id TEXT PRIMARY KEY,
                amount TEXT NOT NULL,
                currency TEXT NOT NULL,
                milestone TEXT NOT NULL,
                status TEXT NOT NULL,
                capture_id TEXT
            )
            """
        )

        connection.execute(
            """
            ALTER TABLE payment_orders
            ADD COLUMN IF NOT EXISTS capture_id TEXT
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS validation_records (
                validation_id TEXT PRIMARY KEY,
                result TEXT NOT NULL,
                validation_json TEXT NOT NULL,
                used INTEGER NOT NULL DEFAULT 0
            )
            """
        )

        connection.execute(
            """
            ALTER TABLE validation_records
            ADD COLUMN IF NOT EXISTS used INTEGER NOT NULL DEFAULT 0
            """
        )

    print("ScopeLock PostgreSQL tables initialized.")
