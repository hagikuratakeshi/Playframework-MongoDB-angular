package models

import scala.xml.NodeSeq
import play.api.libs.json.Json

object DaysClosed {
  def fromXml(elem: NodeSeq): DaysClosed = {
    val daysClosed = elem \\ "DaysClosed"
    return DaysClosed(
      (daysClosed \ "@hol").text == "1",
      (daysClosed \ "@sun").text == "1",
      (daysClosed \ "@sat").text == "1",
      (daysClosed \ "@fri").text == "1",
      (daysClosed \ "@thu").text == "1",
      (daysClosed \ "@wed").text == "1",
      (daysClosed \ "@tue").text == "1",
      (daysClosed \ "@mon").text == "1")
  }
  
  implicit val daysClosedJsonWriter = Json.writes[DaysClosed]
}

case class DaysClosed(holiday: Boolean,
  sunday: Boolean,
  saturday: Boolean,
  friday: Boolean,
  thursday: Boolean,
  wednesday: Boolean,
  tuesday: Boolean,
  monday: Boolean)
  