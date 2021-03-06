import play.api.libs.functional.syntax.toFunctionalBuilderOps
import util.ParseDouble
import scalaj.http.Http
import scalaj.http.HttpOptions
import models.Event
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import connpass.fetcher.ConnpassEventFetcher
import play.api.libs.json.Json
import play.api.libs.json.JsValue
import connpass.models.ConnpassEvent
import java.util.Date
import play.api.Logger
import org.joda.time.DateTime

object ApplicationLauncher extends App {

  println("Started")
  //  queryTokyoWebArtBeat 
  //  mongoQueries
  //  mongoGetOneById("523da7b63004644e663a6989")
  //  connpassQuery
  queryPastEvents

  val list = List(1, 2, 3, 4)
  val list2 = List(31, 5, 8, 7)
  println(list2 ++ list)
  println(reverse(list))

  def reverse[T](list: List[T]): List[T] = {
    list match {
      case Nil => Nil
      case (head :: tail) => reverse(tail) ++ List(head)
    }
  }
  def mongoGetOneById(id: String) = {
    val event = Event.findOne(MongoDBObject("_id" -> id))
    println(event.get)
  }

  def connpassQuery = {
    val fetcher = new ConnpassEventFetcher
    val response = fetcher.get(List())
    val events = (Json.parse(response) \ "events").as[Seq[ConnpassEvent]]
    println(events)
  }
  def mongoQueries = {
    val nearEvents = Event.find(MongoDBObject("latlng" ->
      MongoDBObject("$geoWithin" ->
        MongoDBObject("$center" -> List((35.671208, 139.76517), 0.001)))))

    nearEvents.foreach(println(_))
  }

  def queryTokyoWebArtBeat = {
    val events = Http("http://www.tokyoartbeat.com/list/event_searchNear").header("Charset", "utf-8").param("latitude", "35.671208")
      .param("longitude", "139.76517").option(HttpOptions.connTimeout(10000)).option(HttpOptions.readTimeout(10000))
      .param("MaxResults", "50").asXml

    for (event <- events \\ "Event") {
      val eventObj = Event.fromXml(event)

      val dbo = Event.toDBObject(eventObj)
      println(dbo)
      Event.save(eventObj)
      //      println(Event.toDBObject(eventObj))
      println("From Db")
    }
  }

  def queryPastEvents = {
    val twoDaysAgo = new DateTime().minusDays(2)
    val removeResult = Event.remove(MongoDBObject("dateEnd" -> MongoDBObject("$lt" -> twoDaysAgo.toDate())))
    println("Event Deleted from Tokyo Art Beat : " + removeResult)
  }
}