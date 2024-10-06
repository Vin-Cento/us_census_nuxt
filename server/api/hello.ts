export default defineEventHandler((event) => {
  console.log('event', event)
  console.log('hello world')
  return {
    hello: "world"
  }
})
