package fetcher

import scalaj.http.Http
import models.Event
import scalaj.http.HttpOptions

class TokyoArtBeatEventFetcher {
  val ENDPOINT = "http://www.tokyoartbeat.com/list/event_searchNear"

  def get(latitude: Double, longitude: Double): Seq[Event] = {
    val events = Http(ENDPOINT).header("Charset", "utf-8")
      .param("latitude", latitude.toString).param("longitude", longitude.toString).param("SortOrder", "distance")
      .param("SearchRange", "3000m").option(HttpOptions.connTimeout(30000)).option(HttpOptions.readTimeout(30000))
      .param("MaxResults", "50").asXml
    val eventObjs = (events \\ "Event").map(Event.fromXml(_))
    return eventObjs
  }

  def get(latitude: Double, longitude: Double, params: List[(String, String)]): Seq[Event] = {
    val events = Http(ENDPOINT).header("Charset", "utf-8")
      .param("latitude", latitude.toString).param("longitude", longitude.toString).option(HttpOptions.connTimeout(30000))
      .option(HttpOptions.readTimeout(30000)).params(params).asXml
    val eventObjs = (events \\ "Event").map(Event.fromXml(_))
    return eventObjs
  }
}