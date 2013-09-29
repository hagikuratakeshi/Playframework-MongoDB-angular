package connpass.fetcher

import scalaj.http.Http
import scalaj.http.HttpOptions

class ConnpassEventFetcher {
  val ENDPOINT = "http://connpass.com/api/v1/event/"

  def get(params: List[(String, String)]):String = {
     val events = Http(ENDPOINT).param("count", "10")
       .option(HttpOptions.connTimeout(30000)).option(HttpOptions.readTimeout(30000))
       .asString
     return events
  }
}
