import axios from "axios"

export default defineEventHandler((event) => {
  const x = readBody(event)
  return x
})
