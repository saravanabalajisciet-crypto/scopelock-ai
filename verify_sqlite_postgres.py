import sqlite3
from pathlib import Path

from database import get_connection

SQLITE_PATH = Path(__file__).with_name("scopelock_orders.db")

TABLES = {
    "payment_orders": (
        ["order_id", "amount", "currency", "milestone", "status", "capture_id"],
        "order_id",
    ),
    "validation_records": (
        ["validation_id", "result", "validation_json", "used"],
        "validation_id",
    ),
}


def verify():
    source = sqlite3.connect(SQLITE_PATH)
    source.row_factory = sqlite3.Row

    all_match = True

    try:
        with get_connection() as target:
            for table, (columns, primary_key) in TABLES.items():
                column_sql = ", ".join(columns)

                sqlite_rows = source.execute(
                    f"SELECT {column_sql} FROM {table} ORDER BY {primary_key}"
                ).fetchall()

                postgres_rows = target.execute(
                    f"SELECT {column_sql} FROM {table} ORDER BY {primary_key}"
                ).fetchall()

                source_data = [
                    tuple(row[column] for column in columns)
                    for row in sqlite_rows
                ]

                target_data = [
                    tuple(row[column] for column in columns)
                    for row in postgres_rows
                ]

                matches = source_data == target_data

                print(f"\n{table}:")
                print("SQLite rows:", len(source_data))
                print("Neon rows:", len(target_data))
                print("Exact data match:", "YES" if matches else "NO")

                if not matches:
                    all_match = False
                    print("WARNING: Differences detected. Do not switch databases yet.")

    finally:
        source.close()

    print("\nOVERALL:", "VERIFIED" if all_match else "VERIFICATION FAILED")


if __name__ == "__main__":
    verify()
