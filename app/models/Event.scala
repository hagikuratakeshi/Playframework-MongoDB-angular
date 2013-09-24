package models

import util.ParseDouble
import scala.xml.Node
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
//import com.novus.salat.global._
import salat.custom_context._
import com.novus.salat.annotations._
import com.mongodb.casbah.Imports._
import com.novus.salat.dao.{ SalatDAO, ModelCompanion }
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json.Json
import java.util.Date
import com.novus.salat.Context
import play.api.Play

object Event extends ModelCompanion[Event, ObjectId] {
  def fromXml(xml: Node): Event = {
    val venueNode = xml \\ "Venue"
    return Event(new ObjectId().toString(), (xml \ "Name").text, Venue.fromXml(xml \\ "Venue"), (xml \\ "Media").text, (xml \\ "Description").text,
      Image.fromXml(xml), (xml \\ "Karma").text, (xml \\ "Price").text, fromXmlToDateTime(xml, "DateStart"),
      fromXmlToDateTime(xml, "DateEnd"), (xml \\ "ScheduleNote").text, LatLng(ParseDouble.parseDouble((xml \\ "Latitude").text).get,
        ParseDouble.parseDouble((xml \\ "Longitude").text).get))
  }

  def fromXmlToDateTime(xml: Node, elementName: String): Date = {
    val dateNode = xml \\ elementName
    val format = DateTimeFormat.forPattern("yyyy-MM-dd")
    try {
      return format.parseDateTime(dateNode.text).toDate()
    } catch {
      case _: java.lang.IllegalArgumentException => null
    }
  }

  implicit val eventJsonWriter = Json.writes[Event]

  // salat objects
  val collection = MongoConnection()("eventoyou")("events")
  val dao = new SalatDAO[Event, ObjectId](collection = collection) {}
}

case class Event(@Key("_id") id: String, name: String, venue: Venue, media: String, description: String,
  imageLarge: Image, karma: String, price: String, dateStart: Date, dateEnd: Date,
  scheduleNote: String, latlng: LatLng)