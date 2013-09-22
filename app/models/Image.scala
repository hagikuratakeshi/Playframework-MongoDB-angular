package models

import scala.xml.Node

import play.api.libs.json.Json
import util.IntUtil

object Image {
	def fromXml(xml: Node): Image = {
		val images = (xml \\ "Image")
	  images.sortWith(
	      (e1, e2) => (IntUtil.getValue((e1 \ "@width").text) compareTo IntUtil.getValue((e2 \ "@width").text)) > 0)
	  if (images.length > 0) {
	  	val biggestImage = images.last
	  	return Image(IntUtil.getValue((biggestImage \ "@width").text), (biggestImage \ "@src").text)
	  } else {
	  	return null
	  }
	}
	
  implicit val imageJsonWriter = Json.writes[Image]
}

case class Image(width: Int, source: String)