package service.tokyo_art_beat

import models.Venue
import scala.xml.{ Elem, XML }
import org.joda.time.DateTime
import models.DaysClosed

//object XmlConverter {
//  def toVenue(xml: Elem): Venue = {
//    return Venue((xml \\ "Name").text, (xml \\ "Type").text, (xml \\ "Address").text,
//      (xml \\ "Phone").text, (xml \\ "Fax").text, (xml \\ "Access").text, (xml \\ "Area").text,
//      (xml \\ "OpeningHour").text, new DateTime((xml \\ "ClosingHour").text), DaysClosed.fromXml(xml),
//      (xml \\ "ScheduleNote").text)
//  }
//}