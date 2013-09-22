package controllers.api

import fetcher.TokyoArtBeatEventFetcher
import play.api._
import play.api.libs.json._
import play.api.mvc._
import models.Event
import com.mongodb.casbah.commons.MongoDBObject
import com.novus.salat.Context

object EventApi extends Controller {

  val artBeatFetcher = new TokyoArtBeatEventFetcher

  def search(latitude: Double, longitude: Double) = Action {
    val events = artBeatFetcher.get(latitude, longitude)
    Ok(Json.toJson(events))
  }

  def searchWithin(latitude: Double, longitude: Double) = Action {
    val events = Event.find(MongoDBObject("latlng" ->
      MongoDBObject("$geoWithin" ->
        MongoDBObject("$center" -> List((latitude, longitude), 0.01)))))
    Ok(Json.toJson(events.toList))
  }
  
  def searchPolygon(latMax: Double, latMin: Double, lonMax: Double, lonMin: Double) = Action {
    val events = Event.find(MongoDBObject("latlng" ->
      MongoDBObject("$geoWithin" ->
        MongoDBObject("$polygon" -> 
            List(List(latMax, lonMin), (latMax, lonMax), (latMin, lonMin), (latMin, lonMax)
                )))))
    Ok(Json.toJson(events.toList))
  }
    
  def details(id: String) = Action {
    val event = Event.findOne(MongoDBObject("_id" -> id))
    Ok(Json.toJson(event.get))
  }
}