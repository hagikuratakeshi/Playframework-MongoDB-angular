package connpass.models

import java.util.Date
import play.api.libs.json.Json

object ConnpassEvent {
   implicit val eventJsonRead = Json.reads[ConnpassEvent]
   implicit val eventJsonWriter = Json.writes[ConnpassEvent]
}

case class ConnpassEvent(event_id: Long, title: String, `catch`: Option[String], description: Option[String], 
    event_url: Option[String], hash_tag: Option[String], started_at: Option[Date], ended_at: Option[Date], 
    limit: Option[Int], event_type: Option[String],
    address: Option[String], place: Option[String], lat: Option[Double], lon: Option[Double], 
    owner_id: Option[Int], owner_nickname: Option[String], 
    owner_display_name: Option[String], accepted: Option[Int], waiting: Option[Int], updated_at: Option[Date])