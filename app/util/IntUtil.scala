package util

object Int {
  def unapply(s: String): Option[Int] = try {
    Some(s.toInt)
  } catch {
    case _: java.lang.NumberFormatException => None
  }
}

object IntUtil {
  def getValue(s: String): Int = s match {
    case "inf" => Integer.MAX_VALUE
    case Int(x) => x
    case _ => sys.error("not a number")
  }
}

object ParseDouble {
  def parseDouble(s: String) = try { Some(s.toDouble) } catch { case _ => None }
}