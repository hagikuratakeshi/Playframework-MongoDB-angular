package actor

import fetcher.TokyoArtBeatEventFetcher
import resource.TokyoCenterPoints
import models.Event
import com.mongodb.casbah.commons.MongoDBObject
import akka.actor.UntypedActor
import play.api.Logger

class TokyoArtBeatRequestActor extends UntypedActor {

  val fetcher = new TokyoArtBeatEventFetcher
  
  override def onReceive(message: Any) {
    val head = TokyoCenterPoints.centerPoints.foreach(c => {
      val events = fetcher.get(c._1, c._2)

      Logger.info("TokyoArtBeat events found : " + events.size + " Center : " + c)
      events.foreach(e => {
        if (Event.find(MongoDBObject("name" -> e.name)).size == 0) {
          Event.save(e)
          Logger.info("Event saved from Tokyo Art Beat : " + e)
        }
      })
      // TODO use guava to rate limit
      Thread.sleep(1000)
    })
  }
}