package schedulejob

import fetcher.TokyoArtBeatEventFetcher
import resource.TokyoCenterPoints
import models.Event
import com.mongodb.casbah.commons.MongoDBObject

object TokyoArtBeatRequester extends App {

  val fetcher = new TokyoArtBeatEventFetcher

  val head = TokyoCenterPoints.centerPoints.foreach(c => {
    val events = fetcher.get(c._1, c._2)

    println("Count : " + events.size + " Center : " + c)

    events.foreach(e => {
      if (Event.find(MongoDBObject("name" -> e.name)).size == 0) Event.save(e)
    })
    Thread.sleep(1000)
  })

}