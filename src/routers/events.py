from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException, status
from src.db import get_session
from sqlalchemy.orm import Session
from src.schemas import Event
import src.models
from src.crud import EventActions


events_router = APIRouter(prefix='/events', tags=["events"],
                          responses={404: {"description": "Not found"}})

@events_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Event)
def get_event(request: Request, id: int, db: Session = Depends(get_session)):
    event = EventActions().get_event_by_id(db=db, id=id)
    if event is None:
        raise HTTPException(status_code=404, detail=f"No event with id {id} found")
    print("event_category_id:", event.category)
    return event

@events_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Event])
def get_events(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    events = EventActions().get_events(db=db, skip=skip, limit=limit)
    if events is None:
        raise HTTPException(status_code=404, detail=f"No events found")
    return events

@events_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Event)
def create_event(request: Request, event: src.models.Event, db: Session = Depends(get_session)):
    event = EventActions().create_event(db=db, event=event)
    return event

@events_router.delete("/delete/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(request: Request, event_id: int, db: Session = Depends(get_session)):
    EventActions().delete_event_by_id(db=db, id=event_id)
