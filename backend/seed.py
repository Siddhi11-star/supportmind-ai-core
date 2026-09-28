import sys
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import asyncio
from backend.app.database import SessionLocal, engine, Base
from backend.app.models import Ticket
from backend.app.services.pipeline import ticket_pipeline

async def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Ticket).count()
        if count == 0:
            print("Seeding initial enterprise demo ticket into database...")
            sample_message = (
                "I was charged twice on order #8821-347 on Oct 14 for $149.00 and still haven't received my refund. "
                "This is unacceptable — please resolve immediately."
            )
            ticket = await ticket_pipeline.process_ticket(
                message=sample_message,
                subject="Duplicate charge on invoice #8821-347",
                customer_name="Alex Stone",
                customer_email="alex.stone@enterprise.io",
                db=db,
            )
            print(f"Demo ticket successfully created with ID: {ticket.id}")
        else:
            print(f"Database already has {count} tickets.")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(seed())
