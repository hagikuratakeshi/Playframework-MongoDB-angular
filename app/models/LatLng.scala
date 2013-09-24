package models

import play.api.libs.json.Json

object LatLng {
  implicit val latlngJsonWriter = Json.writes[LatLng]
}

case class LatLng(longitude: Double, latitude: Double)