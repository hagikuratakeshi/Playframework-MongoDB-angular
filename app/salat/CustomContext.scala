package salat

import com.novus.salat.Context
import play.api.Play

package object custom_context {

  implicit val ctx = new Context {
    val name = "Custom_Classloader"
  }
  
  try {
    ctx.registerClassLoader(Play.classloader(Play.current))
  } catch {
    case t: Throwable => 
  }
}