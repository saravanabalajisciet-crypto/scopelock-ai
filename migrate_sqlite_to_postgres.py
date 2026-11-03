import sqlite3
from pathlib import Path

from database import get_connection, init_db


SQLITE_PATH = Path(__file__).with_name("scopelock_orders.db")


def migrate():
    if not SQLITE_PATH.exists():
        raise FileNotFoundError(
            f"SQLite database not found: {SQLITE_PATH}"
        )

    init_db()

    source = sqlite3.connect(SQLITE_PATH)
    source.row_factory = sqlite3.Row

    try:
        payment_rows = source.execute(
            """
            SELECT order_id, amount, currency, milestone, status, capture_id
            FROM payment_orders
            """
        ).fetchall()

        validation_rows = source.execute(
            """
            SELECT validation_id, result, validation_json, used
            FROM validation_records
            """
        ).fetchall()

    finally:
        source.close()

    with get_connection() as target:
        for row in payment_rows:
            target.execute(
                """
                INSERT INTO payment_orders
                (order_id, amount, currency, milestone, status, capture_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (order_id) DO NOTHING
                """,
                (
                    row["order_id"],
                    row["amount"],
                    row["currency"],
                    row["milestone"],
                    row["status"],
                    row["capture_id"],
                ),
            )

        for row in validation_rows:
            target.execute(
                """
                INSERT INTO validation_records
                (validation_id, result, validation_json, used)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (validation_id) DO NOTHING
                """,
                (
                    row["validation_id"],
                    row["result"],
                    row["validation_json"],
                    row["used"],
                ),
            )

        payment_count = target.execute(
            "SELECT COUNT(*) AS count FROM payment_orders"
        ).fetchone()["count"]

        validation_count = target.execute(
            "SELECT COUNT(*) AS count FROM validation_records"
        ).fetchone()["count"]

        completed_count = target.execute(
            """
            SELECT COUNT(*) AS count
            FROM payment_orders
            WHERE status = 'COMPLETED'
            """
        ).fetchone()["count"]

    print("\n--- MIGRATION SUMMARY ---")
    print("SQLite payment records read:", len(payment_rows))
    print("SQLite validation records read:", len(validation_rows))
    print("Neon payment records:", payment_count)
    print("Neon validation records:", validation_count)
    print("Neon completed payments:", completed_count)


if __name__ == "__main__":
    migrate()
