package models

import scala.xml.Node
import scala.xml.NodeSeq
import play.api.libs.json.Json

object Venue {
  def fromXml(xml: NodeSeq): Venue = {
    return Venue((xml \ "Name").text, (xml \\ "Type").text, (xml \\ "Address").text,
      (xml \\ "Phone").text, (xml \\ "Fax").text, (xml \\ "Access").text, (xml \\ "Area").text,
      (xml \\ "OpeningHour").text, (xml \\ "ClosingHour").text, DaysClosed.fromXml(xml),
      (xml \\ "ScheduleNote").text)
  }
  
  implicit val venueJsonWriter = Json.writes[Venue]
}

case class Venue(name: String, venueType: String, address: String, phone: String, fax: String,
  access: String, area: String, openingHour: String, closingHour: String,
  daysClosed: DaysClosed, scheduleNote: String)